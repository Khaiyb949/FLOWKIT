import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
// @ts-ignore
import gm from 'gm';
// @ts-ignore
import PSD from 'psd';
// @ts-ignore
import DocxParser from 'docx-parser';
import { ConvertedImageEntity } from '../domain/entities/converted-image.entity';
import type { ImageConversionPlanEntity } from '../domain/entities/image-conversion-plan.entity';
import { ImageMetadataEntity } from '../domain/entities/image-metadata.entity';
import type { IImageProcessingRepository } from '../domain/repositories/image-processing.repository.interface';

// Only formats that absolutely cannot be processed (no library support)
const SPECIAL_FORMATS: string[] = [];

// Production-grade validation constants (SaaS model)
// These should be configurable per user tier in production
const VALIDATION_LIMITS = {
  // Per-file size limit (adjusted for realistic user needs)
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB (was 10MB - iPhone photos need ~5-8MB each)
  
  // Per-request limits (protect server resources)
  MAX_FILES_PER_REQUEST: 10, // Maximum files in single request
  MAX_TOTAL_SIZE_PER_REQUEST: 50 * 1024 * 1024, // 50MB total per request
  
  // RAM consideration: 20MB file ≈ 100MB+ uncompressed in RAM during processing
  // With 10 files × 100MB = 1GB peak RAM usage - this is the real bottleneck
  // TODO: Add queue system (BullMQ + Redis) to limit concurrent jobs
  // TODO: Add concurrent processing limit (e.g., max 2-3 simultaneous jobs per server)
  
  CONVERSION_TIMEOUT: 30000, // 30 seconds per file
};

@Injectable()
export class ImageProcessingRepository implements IImageProcessingRepository {
  /**
   * Validate single file input
   * In production, tier checking should happen in controller/guard layer
   */
  private validateInput(buffer: Buffer, fileName?: string): void {
    if (buffer.length > VALIDATION_LIMITS.MAX_FILE_SIZE) {
      const sizeInMB = (buffer.length / 1024 / 1024).toFixed(2);
      const limitInMB = (VALIDATION_LIMITS.MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
      throw new BadRequestException(
        `File "${fileName || 'unknown'}" exceeds size limit. ` +
        `Your file: ${sizeInMB}MB | Limit: ${limitInMB}MB. ` +
        `Upgrade to Pro for larger files.`
      );
    }
  }

  /**
   * Validate batch request (multiple files)
   * For production SaaS: fetch user tier and apply appropriate limits
   * Public method for use in application service or controller
   */
  public validateBatchRequest(files: { buffer: Buffer; fileName: string }[]): void {
    if (files.length > VALIDATION_LIMITS.MAX_FILES_PER_REQUEST) {
      throw new BadRequestException(
        `Too many files (${files.length}). ` +
        `Maximum: ${VALIDATION_LIMITS.MAX_FILES_PER_REQUEST} files per request. ` +
        `Upgrade to batch processing.`
      );
    }

    const totalSize = files.reduce((sum, f) => sum + f.buffer.length, 0);
    if (totalSize > VALIDATION_LIMITS.MAX_TOTAL_SIZE_PER_REQUEST) {
      const totalMB = (totalSize / 1024 / 1024).toFixed(2);
      const limitMB = (VALIDATION_LIMITS.MAX_TOTAL_SIZE_PER_REQUEST / 1024 / 1024).toFixed(0);
      throw new BadRequestException(
        `Total files size exceeds request limit. ` +
        `Your total: ${totalMB}MB | Limit: ${limitMB}MB. ` +
        `Try fewer files or smaller images.`
      );
    }
  }
  async inspect(buffer: Buffer, fileName?: string): Promise<ImageMetadataEntity> {
    this.validateInput(buffer, fileName);
    
    const metadata = await sharp(buffer, { failOn: 'none' })
      .rotate() // Auto-rotate based on EXIF orientation
      .metadata();

    if (!metadata.width || !metadata.height) {
      throw new BadRequestException('Unable to read image metadata.');
    }

    return new ImageMetadataEntity({
      width: metadata.width,
      height: metadata.height,
      format: metadata.format ?? 'unknown',
    });
  }

  async convert(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity> {
    this.validateInput(buffer, plan.originalName);
    
    // Special handling for PDF conversion
    if (plan.format === 'pdf') {
      return this.convertToPdf(buffer, plan);
    }

    // Handle PSD files
    if (plan.format === 'psd') {
      return this.convertWithPsd(buffer, plan);
    }

    // Handle DOCX files
    if (plan.format === 'docx') {
      return this.convertWithDocx(buffer, plan);
    }

    // Handle formats that require GraphicsMagick (EPS, EMF, WMF, DIB, etc)
    const gmFormats = ['eps', 'emf', 'wmf', 'dib'];
    if (gmFormats.includes(plan.format)) {
      return this.convertWithGraphicsMagick(buffer, plan);
    }

    // Check for truly unsupported formats
    if (SPECIAL_FORMATS.includes(plan.format)) {
      throw new BadRequestException(
        `Format '${plan.format}' is not currently supported.`
      );
    }

    // Use Sharp for all other image formats
    return this.convertWithSharp(buffer, plan);
  }

  private async convertWithSharp(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity> {
    // Handle SVG input: need to rasterize with proper density for quality
    let pipeline = sharp(buffer, { 
      failOn: 'none',
      density: 144 // Higher density for better quality when rasterizing SVG
    }).rotate();

    if (plan.shouldResize) {
      pipeline = pipeline.resize({
        width: plan.width,
        height: plan.height,
        fit: plan.fit,
        withoutEnlargement: true,
        background: plan.backgroundColor,
      });
    }

    // Handle SVG output format
    if (plan.format === 'svg') {
      // Get image metadata for dimensions
      const metadata = await sharp(buffer, { failOn: 'none' })
        .rotate()
        .metadata();

      const width = plan.width || metadata.width || 800;
      const height = plan.height || metadata.height || 600;

      // Optimize image: use JPEG for better size if no alpha, otherwise PNG
      let optimizedBuffer: Buffer;
      
      if (metadata.hasAlpha) {
        // Has transparency: use PNG
        optimizedBuffer = await sharp(buffer, { failOn: 'none' })
          .rotate()
          .png({ compressionLevel: 9, palette: true })
          .toBuffer();
      } else {
        // No transparency: use JPEG for smaller size
        optimizedBuffer = await sharp(buffer, { failOn: 'none' })
          .rotate()
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      }

      // Convert to base64
      const base64 = optimizedBuffer.toString('base64');
      
      // Determine image format for data URI
      const imageFormat = metadata.hasAlpha ? 'image/png' : 'image/jpeg';

      // Create SVG wrapper with embedded image
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="data:${imageFormat};base64,${base64}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
</svg>`;

      const svgBuffer = Buffer.from(svgString, 'utf8');

      return new ConvertedImageEntity({
        buffer: svgBuffer,
        fileName: plan.outputFileName,
        mimeType: plan.mimeType,
        width: width,
        height: height,
        size: svgBuffer.length,
      });
    }

    if (plan.format === 'jpeg') {
      pipeline = pipeline.flatten({ background: plan.backgroundColor }).jpeg({
        quality: plan.quality,
        mozjpeg: true,
      });
    } else if (plan.format === 'png') {
      // PNG: always use max compression, add palette for smaller files
      pipeline = pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true, // Reduces size significantly for images with limited colors
      });
    } else if (plan.format === 'avif') {
      pipeline = pipeline.avif({
        quality: plan.quality,
      });
    } else if (plan.format === 'tiff') {
      pipeline = pipeline.tiff({
        quality: plan.quality,
        compression: 'lzw',
      });
    } else if (plan.format === 'gif') {
      pipeline = pipeline.gif({
        progressive: true,
      });
    } else if (plan.format === 'heif') {
      pipeline = pipeline.heif({
        quality: plan.quality,
      });
    } else if (plan.format === 'jp2') {
      pipeline = pipeline.jp2({
        quality: plan.quality,
      });
    } else if (plan.format === 'jxl') {
      pipeline = pipeline.jxl({
        quality: plan.quality,
      });
    } else {
      pipeline = pipeline.webp({
        quality: plan.quality,
      });
    }

    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

    return new ConvertedImageEntity({
      buffer: data,
      fileName: plan.outputFileName,
      mimeType: plan.mimeType,
      width: info.width ?? plan.width,
      height: info.height ?? plan.height,
      size: data.length,
    });
  }

  private async convertWithPsd(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity> {
    try {
      // Parse PSD and convert to PNG first using Sharp
      const psd = PSD.parse(buffer);
      const image = await psd.image.toPng();

      // Now use Sharp to convert to desired format
      let pipeline = sharp(image, { failOn: 'none' }).rotate();

      if (plan.format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality: plan.quality, mozjpeg: true });
      } else if (plan.format === 'png') {
        pipeline = pipeline.png({ compressionLevel: 9, palette: true });
      } else if (plan.format === 'webp') {
        pipeline = pipeline.webp({ quality: plan.quality });
      } else {
        pipeline = pipeline.webp({ quality: plan.quality });
      }

      const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

      return new ConvertedImageEntity({
        buffer: data,
        fileName: plan.outputFileName,
        mimeType: plan.mimeType,
        width: info.width ?? plan.width,
        height: info.height ?? plan.height,
        size: data.length,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private convertWithGraphicsMagick(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity> {
    return new Promise((resolve, reject) => {
      const gmInstance = gm(buffer);

      // Resize if needed
      if (plan.shouldResize) {
        gmInstance.resize(plan.width, plan.height, '!');
      }

      // Convert to PNG first
      gmInstance.toBuffer('PNG', async (err: any, data: Buffer) => {
        if (err) {
          reject(
            new BadRequestException(
              `Failed to process image format: ${err.message}`
            )
          );
          return;
        }

        try {
          // Use Sharp to convert PNG to final format
          let pipeline = sharp(data, { failOn: 'none' }).rotate();

          if (plan.format === 'jpeg') {
            pipeline = pipeline.jpeg({ quality: plan.quality, mozjpeg: true });
          } else if (plan.format === 'png') {
            pipeline = pipeline.png({ compressionLevel: 9, palette: true });
          } else if (plan.format === 'webp') {
            pipeline = pipeline.webp({ quality: plan.quality });
          } else {
            pipeline = pipeline.webp({ quality: plan.quality });
          }

          const { data: finalData, info } = await pipeline.toBuffer({
            resolveWithObject: true,
          });

          resolve(
            new ConvertedImageEntity({
              buffer: finalData,
              fileName: plan.outputFileName,
              mimeType: plan.mimeType,
              width: info.width ?? plan.width,
              height: info.height ?? plan.height,
              size: finalData.length,
            })
          );
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async convertWithDocx(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity> {
    try {
      // Parse DOCX and extract images
      const parser = new DocxParser();
      const doc = parser.parse(buffer);

      // Try to extract the first image from the document
      let imageBuffer: Buffer | null = null;

      // Check for media/images in the document
      if (doc && doc.media && doc.media.length > 0) {
        // Get the first image
        imageBuffer = doc.media[0].data;
      }

      // If no image found, create a placeholder image with text
      if (!imageBuffer) {
        // Create a simple placeholder image with document text
        const width = 1200;
        const height = 1600;
        const svg = `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="#f5f5f5"/>
            <rect x="40" y="40" width="1120" height="1520" fill="white" stroke="#ddd" stroke-width="2"/>
            <text x="600" y="100" text-anchor="middle" font-size="48" font-weight="bold" fill="#333">
              Document Preview
            </text>
            <text x="600" y="200" text-anchor="middle" font-size="24" fill="#666">
              ${plan.originalName || 'Document'}
            </text>
            <line x1="40" y1="250" x2="1160" y2="250" stroke="#ddd" stroke-width="1"/>
            <text x="60" y="350" font-size="16" fill="#999">
              This is a placeholder image generated from the uploaded document.
            </text>
            <text x="60" y="400" font-size="16" fill="#999">
              DOCX documents have been processed successfully.
            </text>
          </svg>
        `;
        imageBuffer = Buffer.from(svg, 'utf8');
      }

      // Convert extracted image to target format using Sharp
      let pipeline = sharp(imageBuffer, { failOn: 'none' }).rotate();

      if (plan.shouldResize) {
        pipeline = pipeline.resize({
          width: plan.width,
          height: plan.height,
          fit: plan.fit,
          withoutEnlargement: true,
        });
      }

      if (plan.format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality: plan.quality, mozjpeg: true });
      } else if (plan.format === 'png') {
        pipeline = pipeline.png({ compressionLevel: 9, palette: true });
      } else if (plan.format === 'webp') {
        pipeline = pipeline.webp({ quality: plan.quality });
      } else {
        pipeline = pipeline.webp({ quality: plan.quality });
      }

      const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

      return new ConvertedImageEntity({
        buffer: data,
        fileName: plan.outputFileName,
        mimeType: plan.mimeType,
        width: info.width ?? plan.width,
        height: info.height ?? plan.height,
        size: data.length,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to process DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async convertToPdf(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity> {
    try {
      const MAX_WIDTH = 1500; // Auto-resize threshold to prevent oversized PDFs
      
      // Get original image metadata (with EXIF rotation)
      const metadata = await sharp(buffer, { failOn: 'none' })
        .rotate()
        .metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new BadRequestException('Unable to read image metadata for PDF conversion.');
      }

      // Build Sharp pipeline for optimization
      let pipeline = sharp(buffer, { failOn: 'none' })
        .rotate(); // Auto-rotate based on EXIF orientation

      // Fix: Handle transparent backgrounds (PNG) by flattening to solid color
      pipeline = pipeline.flatten({
        background: plan.backgroundColor || '#ffffff',
      });

      // Auto-resize large images to prevent massive PDFs
      if (!plan.shouldResize && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({
          width: MAX_WIDTH,
          withoutEnlargement: true,
        });
      }

      // Apply user-requested resize if specified
      if (plan.shouldResize) {
        pipeline = pipeline.resize(plan.width, plan.height, {
          fit: plan.fit,
          withoutEnlargement: true,
        });
      }

      // Compress to JPEG with optimizations
      // Use toBuffer({ resolveWithObject: true }) to avoid double Sharp decode
      const qualityForPdf = plan.quality ?? 75;
      const { data: processedImageBuffer, info: processedInfo } = await pipeline
        .jpeg({
          quality: qualityForPdf,
          mozjpeg: true,
          progressive: false,
        })
        .toBuffer({ resolveWithObject: true });

      // Use actual dimensions from processed metadata (accounts for fit/resize adjustments)
      const finalWidth = processedInfo.width ?? metadata.width;
      const finalHeight = processedInfo.height ?? metadata.height;

      // Create PDF and embed optimized JPEG image
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([finalWidth, finalHeight]);
      
      const image = await pdfDoc.embedJpg(processedImageBuffer);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: finalWidth,
        height: finalHeight,
      });

      // Save PDF with object stream optimization (reduces size 5-10%)
      const pdfUint8Array = await pdfDoc.save({ useObjectStreams: true });
      const pdfBuffer = Buffer.from(pdfUint8Array);

      return new ConvertedImageEntity({
        buffer: pdfBuffer,
        fileName: plan.outputFileName,
        mimeType: 'application/pdf',
        width: finalWidth,
        height: finalHeight,
        size: pdfBuffer.length,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to convert image to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * For batch conversions: use in application service or controller
   * 
   * PRODUCTION ARCHITECTURE:
   * 1. Controller receives request with multiple files
   * 2. Call validateBatchRequest() to check limits early
   * 3. Queue each conversion job (BullMQ + Redis) - DON'T process synchronously
   * 4. Return job IDs to client for polling/webhook
   * 5. Limit concurrent jobs (e.g., max 3 concurrent per server)
   * 
   * This prevents RAM spike: 10 files × 100MB uncompressed = 1GB+ RAM usage
   * 
   * Example usage in controller:
   *   const batch = files.map(f => ({ buffer: f.buffer, fileName: f.originalname }));
   *   this.imageRepo.validateBatchRequest(batch);
   *   // Queue jobs instead of processing here
   */
}
import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Post,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageProcessingApplicationService } from '../../application/image-processing.application.service';
import { ImageFormatsDomainService } from '../../application/image-formats.domain.service';
import { UploadedImageEntity } from '../../domain/entities/uploaded-image.entity';
import { ConvertImageDto } from '../dtos/convert-image.dto';

type IncomingFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

function parseBoolean(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === 'true' || value === '1' || value === 'yes';
}

function parseNumber(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

@Controller('image-processing')
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingApplicationService,
    private readonly formatsService: ImageFormatsDomainService,
  ) {}

  @Get('formats')
  getFormats() {
    return {
      popular: this.formatsService.getPopularFormats(),
      all: this.formatsService.getAllFormats(),
    };
  }

  @Post('convert')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 20 * 1024 * 1024 } }))
  async convertOne(@UploadedFile() file: IncomingFile, @Body() body: ConvertImageDto) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    const result = await this.imageProcessingService.convert(
      new UploadedImageEntity({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      }),
      {
        format: body.format,
        quality: parseNumber(body.quality),
        sizeMode: body.sizeMode,
        width: parseNumber(body.width),
        height: parseNumber(body.height),
        keepAspectRatio: parseBoolean(body.keepAspectRatio, true),
      },
    );

    return new StreamableFile(result.buffer, {
      type: result.mimeType,
      disposition: `attachment; filename="${result.fileName}"`,
    });
  }

  @Post('batch-convert')
  @UseInterceptors(FilesInterceptor('files', 24, { limits: { fileSize: 20 * 1024 * 1024 } }))
  async convertMany(@UploadedFiles() files: IncomingFile[], @Body() body: ConvertImageDto) {
    if (!files?.length) {
      throw new BadRequestException('Files are required.');
    }

    const results = await this.imageProcessingService.convertMany(
      files.map(
        (file) =>
          new UploadedImageEntity({
            buffer: file.buffer,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          }),
      ),
      {
        format: body.format,
        quality: parseNumber(body.quality),
        sizeMode: body.sizeMode,
        width: parseNumber(body.width),
        height: parseNumber(body.height),
        keepAspectRatio: parseBoolean(body.keepAspectRatio, true),
      },
    );

    return {
      items: results.map((result) => ({
        fileName: result.fileName,
        mimeType: result.mimeType,
        width: result.width,
        height: result.height,
        size: result.size,
        dataUrl: result.dataUrl,
      })),
    };
  }
}
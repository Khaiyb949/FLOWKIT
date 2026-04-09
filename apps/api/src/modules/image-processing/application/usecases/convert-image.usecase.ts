import type { IImageProcessingRepository } from '../../domain/repositories/image-processing.repository.interface';
import { ImageConversionPlanEntity } from '../../domain/entities/image-conversion-plan.entity';
import { UploadedImageEntity } from '../../domain/entities/uploaded-image.entity';
import type { ConvertedImageEntity } from '../../domain/entities/converted-image.entity';

export type ConvertImageInput = {
  format?: string;
  quality?: number;
  sizeMode?: string;
  width?: number;
  height?: number;
  keepAspectRatio?: boolean;
};

export class ConvertImageUseCase {
  constructor(private readonly imageProcessingRepository: IImageProcessingRepository) {}

  async execute(image: UploadedImageEntity, input: ConvertImageInput): Promise<ConvertedImageEntity> {
    if (!image.hasBuffer()) {
      throw new Error('File is required.');
    }

    const metadata = await this.imageProcessingRepository.inspect(image.buffer);

    const plan = ImageConversionPlanEntity.create({
      originalName: image.originalName,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      format: input.format,
      quality: input.quality,
      sizeMode: input.sizeMode,
      width: input.width,
      height: input.height,
      keepAspectRatio: input.keepAspectRatio,
    });

    return this.imageProcessingRepository.convert(image.buffer, plan);
  }
}
import type { ConvertedImageEntity } from '../entities/converted-image.entity';
import type { ImageConversionPlanEntity } from '../entities/image-conversion-plan.entity';
import type { ImageMetadataEntity } from '../entities/image-metadata.entity';

export interface IImageProcessingRepository {
  inspect(buffer: Buffer): Promise<ImageMetadataEntity>;
  convert(buffer: Buffer, plan: ImageConversionPlanEntity): Promise<ConvertedImageEntity>;
}
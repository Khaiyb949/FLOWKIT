import { Injectable } from '@nestjs/common';
import { ConvertImageUseCase, type ConvertImageInput } from './usecases/convert-image.usecase';
import type { IImageProcessingRepository } from '../domain/repositories/image-processing.repository.interface';
import { UploadedImageEntity } from '../domain/entities/uploaded-image.entity';

@Injectable()
export class ImageProcessingApplicationService {
  private convertImageUseCase: ConvertImageUseCase;

  constructor(imageProcessingRepository: IImageProcessingRepository) {
    this.convertImageUseCase = new ConvertImageUseCase(imageProcessingRepository);
  }

  convert(image: UploadedImageEntity, input: ConvertImageInput) {
    return this.convertImageUseCase.execute(image, input);
  }

  async convertMany(images: UploadedImageEntity[], input: ConvertImageInput) {
    return Promise.all(images.map((image) => this.convertImageUseCase.execute(image, input)));
  }
}
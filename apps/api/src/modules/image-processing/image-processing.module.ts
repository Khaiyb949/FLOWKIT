import { Module } from '@nestjs/common';
import { ImageProcessingApplicationService } from './application/image-processing.application.service';
import { ImageFormatsDomainService } from './application/image-formats.domain.service';
import { ImageProcessingRepository } from './infrastructure/image-processing.repository';
import { ImageProcessingController } from './presentation/controllers/image-processing.controller';
import type { IImageProcessingRepository } from './domain/repositories/image-processing.repository.interface';

@Module({
  controllers: [ImageProcessingController],
  providers: [
    {
      provide: 'IImageProcessingRepository',
      useClass: ImageProcessingRepository,
    },
    {
      provide: ImageProcessingApplicationService,
      useFactory: (imageProcessingRepository: IImageProcessingRepository) =>
        new ImageProcessingApplicationService(imageProcessingRepository),
      inject: ['IImageProcessingRepository'],
    },
    ImageFormatsDomainService,
  ],
  exports: [ImageProcessingApplicationService, ImageFormatsDomainService],
})
export class ImageProcessingModule {}
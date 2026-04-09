export class ImageMetadataEntity {
  width!: number;
  height!: number;
  format!: string;

  constructor(data: Partial<ImageMetadataEntity>) {
    Object.assign(this, data);
  }
}
export class ConvertedImageEntity {
  buffer!: Buffer;
  fileName!: string;
  mimeType!: string;
  width!: number;
  height!: number;
  size!: number;

  constructor(data: Partial<ConvertedImageEntity>) {
    Object.assign(this, data);
  }

  get base64(): string {
    return this.buffer.toString('base64');
  }

  get dataUrl(): string {
    return `data:${this.mimeType};base64,${this.base64}`;
  }
}
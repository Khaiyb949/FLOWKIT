export class UploadedImageEntity {
  buffer!: Buffer;
  originalName!: string;
  mimeType!: string;
  size!: number;

  constructor(data: Partial<UploadedImageEntity>) {
    Object.assign(this, data);
  }

  hasBuffer(): boolean {
    return this.buffer instanceof Buffer && this.buffer.length > 0;
  }
}
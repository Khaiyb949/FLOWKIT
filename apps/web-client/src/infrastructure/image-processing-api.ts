import type { BatchConversionResponse, ImageConversionSettings } from '../application/image-conversion.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';

function appendSetting(formData: FormData, key: string, value: string | number | boolean | undefined) {
  if (value === undefined) {
    return;
  }

  formData.append(key, String(value));
}

async function parseError(response: Response) {
  const text = await response.text();

  if (!text) {
    return `Request failed with status ${response.status}.`;
  }

  try {
    const json = JSON.parse(text) as { message?: string | string[] };

    if (Array.isArray(json.message)) {
      return json.message.join(', ');
    }

    if (typeof json.message === 'string') {
      return json.message;
    }
  } catch {
    return text;
  }

  return `Request failed with status ${response.status}.`;
}

export async function convertImage(file: File, settings: ImageConversionSettings) {
  const formData = new FormData();
  formData.append('file', file);
  appendSetting(formData, 'format', settings.format);
  appendSetting(formData, 'quality', settings.quality);
  appendSetting(formData, 'sizeMode', settings.sizeMode);
  appendSetting(formData, 'width', settings.width);
  appendSetting(formData, 'height', settings.height);
  appendSetting(formData, 'keepAspectRatio', settings.keepAspectRatio);

  const response = await fetch(`${API_BASE_URL}/image-processing/convert`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const blob = await response.blob();

  return {
    blob,
    url: URL.createObjectURL(blob),
    size: blob.size,
  };
}

export async function convertImagesBatch(files: File[], settings: ImageConversionSettings) {
  const formData = new FormData();

  files.forEach((file) => formData.append('files', file));
  appendSetting(formData, 'format', settings.format);
  appendSetting(formData, 'quality', settings.quality);
  appendSetting(formData, 'sizeMode', settings.sizeMode);
  appendSetting(formData, 'width', settings.width);
  appendSetting(formData, 'height', settings.height);
  appendSetting(formData, 'keepAspectRatio', settings.keepAspectRatio);

  const response = await fetch(`${API_BASE_URL}/image-processing/batch-convert`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as BatchConversionResponse;
}
import { useQuery } from '@tanstack/react-query';

export interface FormatInfo {
  value: string;
  label: string;
  mimeType: string;
  extension: string;
  category: 'popular' | 'all';
}

export interface FormatsResponse {
  popular: FormatInfo[];
  all: FormatInfo[];
}

export function useImageFormats() {
  return useQuery<FormatsResponse>({
    queryKey: ['image-formats'],
    queryFn: async () => {
      const response = await fetch('/api/image-processing/formats');
      if (!response.ok) throw new Error('Failed to fetch image formats');
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

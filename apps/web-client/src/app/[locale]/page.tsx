import type { Metadata } from 'next';
import ImageConverter from '@/presentation/components/ImageConverter';
import { getClientCopy, isLocale, type Locale } from '@/presentation/i18n/site-copy';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : 'en';
  const copy = getClientCopy(resolvedLocale);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    keywords: copy.metadata.keywords,
    alternates: {
      canonical: `/${resolvedLocale}`,
      languages: {
        en: '/en',
        vi: '/vi',
      },
    },
    openGraph: {
      title: copy.metadata.title,
      description: copy.metadata.description,
      locale: resolvedLocale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
  };
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : 'en';

  return <ImageConverter locale={resolvedLocale} />;
}
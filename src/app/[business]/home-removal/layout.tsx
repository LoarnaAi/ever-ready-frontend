/** @format */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBusinessConfig, getAllBusinessRefs, getFaviconMetadata } from '@/lib/business';
import { BusinessProvider } from '@/lib/business/BusinessContext';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ business: string }>;
}

export async function generateStaticParams() {
  const refs = getAllBusinessRefs();
  return refs.map((business) => ({ business }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ business: string }>;
}): Promise<Metadata> {
  const { business } = await params;
  const config = getBusinessConfig(business);
  const faviconMeta = getFaviconMetadata(config);

  return {
    title: config ? `Home Removal - ${config.busRef}` : 'Home Removal',
    icons: faviconMeta,
  };
}

export default async function BusinessHomeRemovalLayout({
  children,
  params,
}: LayoutProps) {
  const { business } = await params;
  const config = getBusinessConfig(business);

  if (!config) {
    notFound();
  }

  return (
    <BusinessProvider config={config}>
      {children}
    </BusinessProvider>
  );
}

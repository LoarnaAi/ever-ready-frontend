/** @format */

import { notFound } from 'next/navigation';
import { getBusinessConfig, getAllBusinessSlugs } from '@/lib/business';
import { BusinessProvider } from '@/lib/business/BusinessContext';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ business: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBusinessSlugs();
  return slugs.map((business) => ({ business }));
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

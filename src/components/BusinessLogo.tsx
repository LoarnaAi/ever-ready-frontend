/** @format */

'use client';

import Image from 'next/image';
import { useOptionalBusinessConfig, getBusinessLogos } from '@/lib/business';

interface BusinessLogoProps {
  /** Logo variant: 'full' for wide logo, 'square' for icon/square logo */
  variant?: 'full' | 'square';
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Image loading priority (for above-the-fold images) */
  priority?: boolean;
}

export default function BusinessLogo({
  variant = 'full',
  width = 120,
  height = 40,
  className = '',
  priority = false,
}: BusinessLogoProps) {
  const businessContext = useOptionalBusinessConfig();
  const logos = getBusinessLogos(businessContext?.config || null);

  const src = variant === 'square' ? logos.logoSquare : logos.logo;

  // For external URLs (legacy logoUrl), use regular img tag
  if (logos.isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={logos.alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // For local images, use Next.js Image for optimization
  return (
    <Image
      src={src}
      alt={logos.alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={{ objectFit: 'contain' }}
    />
  );
}

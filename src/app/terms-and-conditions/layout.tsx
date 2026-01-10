import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions - Ever Ready Response',
  description: 'Terms and conditions for Ever Ready Response emergency services',
}

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}

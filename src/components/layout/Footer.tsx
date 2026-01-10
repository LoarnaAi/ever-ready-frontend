import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-everready-dark border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-300">
            &copy; {new Date().getFullYear()} EverReady. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

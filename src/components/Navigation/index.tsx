import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { SocialLinks } from './SocialLinks';

export const Navigation = () => (
  <nav className="container mx-auto p-4 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
    <div className="flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
        <Terminal className="h-6 w-6 text-blue-400" />
        <span className="text-2xl font-bold">domm.dev</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
        <Link href="/projects" className="hover:text-blue-400 transition-colors">Projects</Link>
        <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
        <div className="flex gap-4">
          <SocialLinks />
        </div>
      </div>
    </div>
  </nav>
);
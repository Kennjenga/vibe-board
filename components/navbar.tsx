"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-[var(--neon-blue)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="cyber-logo">V</div>
            <h1 className="text-2xl font-bold glow-text hidden sm:block" style={{ color: 'var(--neon-blue)' }}>
              VIBE BOARD
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-4 ml-8">
            <Link
              href="/vibes"
              className={`px-3 py-2 rounded-lg transition-all ${
                pathname === '/vibes'
                  ? 'bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] font-medium'
                  : 'hover:bg-white/10'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg transition-all ${
                pathname === '/about'
                  ? 'bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] font-medium'
                  : 'hover:bg-white/10'
              }`}
            >
              About
            </Link>
          </div>
        </div>

        <ConnectButton
          label="Log in"
          accountStatus="address"
          chainStatus="icon"
        />
      </div>
    </nav>
  );
}

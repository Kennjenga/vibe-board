"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="cyber-navbar">
      <div className="px-6 py-3 flex justify-between items-center">
        {/* Logo on the left */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            className="cyber-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            V
          </motion.div>
          <h1 className="text-2xl font-bold cyber-text hidden sm:block">
            VIBE BOARD
          </h1>
        </Link>

        {/* Navigation links centered */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6">
          <Link
            href="/vibes"
            className={`cyber-navbar-link ${
              pathname === '/vibes' ? 'cyber-navbar-link-active' : ''
            }`}
          >
            Explore
          </Link>
          <Link
            href="/about"
            className={`cyber-navbar-link ${
              pathname === '/about' ? 'cyber-navbar-link-active' : ''
            }`}
          >
            About
          </Link>
        </div>

        {/* Connect button on the right */}
        <ConnectButton
          label="Connect"
          accountStatus="address"
          chainStatus="icon"
        />
      </div>
    </nav>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const [isHovering, setIsHovering] = useState(false);

  // Setup scroll animations
  const { scrollY } = useScroll();

  // Background animation elements component
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle matte gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 247, 255, 1) 100%)',
          opacity: 0.9
        }}
      />

      {/* Scattered, soft circular spots of color */}
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = [
          'rgba(255, 45, 189, 0.15)', // Neon Pink (muted)
          'rgba(0, 229, 255, 0.15)',  // Neon Blue (muted)
          'rgba(181, 55, 242, 0.15)'  // Neon Purple (muted)
        ];

        // Create larger, more spread out, softer blobs
        const size = Math.random() * 500 + 200;
        const animDuration = Math.random() * 60 + 40; // Slower animation
        const delay = Math.random() * 10;

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.2 + 0.05, // Very subtle opacity
              background: `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 80%)`,
              animation: `float ${animDuration}s infinite ease-in-out`,
              animationDelay: `${delay}s`,
              filter: 'blur(80px)', // Extra blurry for soft edges
              transform: 'translate3d(0, 0, 0)',
              mixBlendMode: 'multiply' // Softer blend mode
            }}
          />
        );
      })}
    </div>
  );


  // Hero section component with redesigned layout
  const HeroSection = () => {
    // Parallax effect for hero elements
    const titleY = useTransform(scrollY, [0, 300], [0, -50]);
    const imageY = useTransform(scrollY, [0, 300], [0, 30]);
    const statsOpacity = useTransform(scrollY, [0, 200], [0, 1]);

    return (
      <div className="relative py-20">
        {/* Background accent for hero section */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent z-0" />

        {/* Main hero content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Title and main content - centered for impact */}
          <motion.div
            className="text-center mb-16"
            style={{ y: titleY }}
          >
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Share Your <span className="cyber-text">Vibe</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Express yourself on the decentralized social platform where your mood becomes an NFT.
              Connect with creators and own your digital expression.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href="/vibes"
                className="cyber-button-primary text-lg px-10 py-4 rounded-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {isHovering ? "Let's Go! →" : "Start Vibing"}
              </Link>

              <Link href="/about" className="cyber-button-secondary text-lg px-10 py-4 rounded-full">
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats section - appears on scroll */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            style={{ opacity: statsOpacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="cyber-panel p-6 text-center">
              <span className="text-4xl font-bold cyber-text block mb-2">10K+</span>
              <span className="text-lg text-gray-600">Daily Vibes</span>
            </div>
            <div className="cyber-panel p-6 text-center">
              <span className="text-4xl font-bold cyber-text block mb-2">5K+</span>
              <span className="text-lg text-gray-600">Active Users</span>
            </div>
            <div className="cyber-panel p-6 text-center">
              <span className="text-4xl font-bold cyber-text block mb-2">50K+</span>
              <span className="text-lg text-gray-600">NFTs Created</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Vibe preview component
  const VibePreview = () => {
    const vibeData = [
      { emoji: '😎', phrase: "Feeling unstoppable today!", color: "var(--neon-pink)", likes: 42 },
      { emoji: '✨', phrase: "Just vibing in the metaverse", color: "var(--neon-blue)", likes: 28 },
      { emoji: '🚀', phrase: "To the moon and beyond!", color: "var(--neon-purple)", likes: 67 },
      { emoji: '🌈', phrase: "Spreading positive energy", color: "var(--cyber-green)", likes: 31 }
    ];

    return (
      <div className="lg:w-1/2 relative">
        <div className="cyber-device will-change-transform">
          <div className="cyber-screen">
            <div className="cyber-screen-content scrollbar-thin scrollbar-thumb-purple-200">
              <div className="vibe-preview-grid">
                {vibeData.map((vibe, i) => (
                  <div key={i} className="vibe-preview-card">
                    <div className="flex justify-between items-start">
                      <span className="text-2xl">{vibe.emoji}</span>
                      <span className="text-sm text-gray-500">2h ago</span>
                    </div>
                    <p className="text-lg my-2 font-medium" style={{ color: vibe.color }}>
                      {vibe.phrase}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">♡ {vibe.likes}</span>
                      <span className="text-xs text-gray-500">0x1a2b...3c4d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 cyber-badge-large">
          <span className="text-xl font-bold">Web3</span>
        </div>
      </div>
    );
  };

  // Features section component with horizontal timeline
  const FeaturesSection = () => {
    const features = [
      {
        icon: "🔗",
        title: "Connect",
        description: "Link your wallet and join the Vibe Board community in seconds. No lengthy sign-up process required.",
        detail: "Simply connect your wallet with a single click. We support multiple wallet providers, making it easy to get started regardless of which wallet you prefer."
      },
      {
        icon: "✍️",
        title: "Create",
        description: "Share your daily vibe with text, emoji, and images. Express yourself in a way that's uniquely you.",
        detail: "Choose an emoji that represents your mood, select a color that matches your vibe, and add a phrase to express yourself. Each vibe is minted as a unique NFT on the blockchain."
      },
      {
        icon: "🏆",
        title: "Collect",
        description: "Build your streak and earn rewards for consistent vibing. The longer your streak, the greater the rewards.",
        detail: "Post daily to build your streak. Earn special rewards and recognition for consistent participation. Your vibes become part of your personal collection that you truly own."
      }
    ];

    return (
      <div className="py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-6 cyber-text"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Express yourself and connect with others through shared emotions in three simple steps
          </motion.p>
        </motion.div>

        {/* Horizontal timeline with steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-blue)] to-[var(--neon-purple)] rounded-full" />

          {/* Timeline steps */}
          <div className="relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-center mb-24 last:mb-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
              >
                {/* Step number and icon */}
                <div className={`flex-shrink-0 mb-6 md:mb-0 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-lg border-2 border-[var(--neon-blue)]">
                      {feature.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--neon-pink)] flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Content with staggered animation */}
                <div className={`md:w-2/3 ${index % 2 === 1 ? 'md:order-1 md:pr-16 text-right' : 'md:pl-16'}`}>
                  <motion.h3
                    className="text-2xl font-bold mb-3"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p
                    className="text-lg text-gray-700 mb-4"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                  >
                    {feature.description}
                  </motion.p>

                  <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                  >
                    {feature.detail}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Benefits section component with parallax effects
  const BenefitsSection = () => {
    // Parallax scroll effects
    const leftPanelY = useTransform(scrollY, [1000, 1800], [100, -100]);
    const rightPanelY = useTransform(scrollY, [1000, 1800], [50, -50]);
    const opacityScale = useTransform(scrollY, [1000, 1200], [0.5, 1]);

    return (
      <div className="py-32 relative">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--neon-blue)]/5 to-transparent z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 cyber-text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Choose Vibe Board?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Vibe Board offers a unique combination of social expression and blockchain technology,
              giving you full ownership of your content while connecting with others.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              className="cyber-panel relative overflow-hidden"
              style={{ y: leftPanelY, opacity: opacityScale }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative accent */}
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[var(--neon-pink)]/10 blur-xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-[var(--neon-pink)]/10 flex items-center justify-center text-3xl mb-6 border border-[var(--neon-pink)]/30">
                  🔐
                </div>

                <h3 className="text-2xl font-bold mb-4">True Ownership</h3>
                <p className="text-gray-700 mb-6 text-lg">
                  Unlike traditional social platforms, your content on Vibe Board belongs to you.
                  Each vibe you create is minted as an NFT on the blockchain, giving you verifiable ownership.
                </p>

                <ul className="space-y-4 text-gray-700">
                  {["Your vibes are stored on the blockchain",
                    "You maintain ownership of your content",
                    "Trade or transfer your vibes as you wish"].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                    >
                      <span className="text-[var(--neon-pink)] text-xl">✓</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="cyber-panel relative overflow-hidden"
              style={{ y: rightPanelY, opacity: opacityScale }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative accent */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[var(--neon-blue)]/10 blur-xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-[var(--neon-blue)]/10 flex items-center justify-center text-3xl mb-6 border border-[var(--neon-blue)]/30">
                  👥
                </div>

                <h3 className="text-2xl font-bold mb-4">Community Connection</h3>
                <p className="text-gray-700 mb-6 text-lg">
                  Vibe Board is more than just a platform—it's a community of like-minded individuals
                  sharing their authentic selves through vibes.
                </p>

                <ul className="space-y-4 text-gray-700">
                  {["Connect with others through shared emotions",
                    "Discover new perspectives and expressions",
                    "Build meaningful connections based on authenticity"].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                    >
                      <span className="text-[var(--neon-blue)] text-xl">✓</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  // Footer component
  const Footer = () => (
    <footer className="mt-24 pt-12 border-t border-[var(--neon-blue)]/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center mb-4">
            <div className="cyber-logo-small mr-2">V</div>
            <h3 className="text-xl font-bold cyber-text">VIBE BOARD</h3>
          </div>
          <p className="text-gray-700">
            Express yourself. Mint the moment. Connect with others through shared emotions.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Platform</h4>
          <ul className="space-y-2">
            <li><Link href="/vibes" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">Explore Vibes</Link></li>
            <li><Link href="/about" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">About</Link></li>
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Community</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">Twitter</a></li>
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">Discord</a></li>
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">Telegram</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">Documentation</a></li>
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">GitHub</a></li>
            <li><a href="#" className="text-gray-700 hover:text-[var(--neon-blue)] transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--neon-blue)]/10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-gray-700">Vibe Board © 2025 - All rights reserved</span>
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-[var(--neon-blue)] transition-colors">Terms</a>
          <a href="#" className="text-gray-600 hover:text-[var(--neon-blue)] transition-colors">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-[var(--neon-blue)] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );

  // Safe localStorage access with client-side detection
  const isClient = typeof window !== 'undefined';

  return (
    <div className="min-h-screen overflow-hidden relative bg-white">
      <BackgroundElements />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <Footer />
      </div>
    </div>
  );
}
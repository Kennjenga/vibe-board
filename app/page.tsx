'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const [isHovering, setIsHovering] = useState(false);
  
  // Background animation elements component
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = [
          'rgba(255, 45, 148, 0.3)', // Pink
          'rgba(0, 255, 249, 0.3)',   // Blue
          'rgba(181, 55, 242, 0.3)'   // Purple
        ];
        
        const size = Math.random() * 300 + 100;
        const animDuration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        return (
          <div 
            key={i}
            className="absolute rounded-full cyber-glow backdrop-blur-3xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              background: `radial-gradient(circle, ${colors[Math.floor(Math.random() * 3)]} 0%, transparent 70%)`,
              animation: `float ${animDuration}s infinite ease-in-out`,
              animationDelay: `${delay}s`,
              filter: 'blur(40px)',
              transform: 'translate3d(0, 0, 0)'
            }}
          />
        );
      })}
    </div>
  );

  // Header component
  const Header = () => (
    <header className="flex justify-between items-center mb-16">
      <div className="flex items-center">
        <div className="cyber-logo mr-3">V</div>
        <h1 className="text-3xl font-bold cyber-text">VibeZ</h1>
      </div>
      
      {isConnected ? (
        <Link href="/vibes" className="cyber-button-primary">
          Enter App
        </Link>
      ) : (
         <ConnectButton label="Log in" />
      )}
    </header>
  );

  // Hero section component
  const HeroSection = () => (
    <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
      <div className="lg:w-1/2">
        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Share Your <span className="cyber-text">Vibe</span>, 
          <br />Connect the <span className="text-cyan-500">Future</span>
        </h2>
        
        <p className="text-xl text-gray-700 mb-8">
          Express yourself with VibeZ - the decentralized social platform where your mood becomes an NFT. Share daily vibes, collect streaks, and connect with the community.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/vibes" 
            className="cyber-button-primary text-lg px-8 py-4"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isHovering ? "Let's Go! →" : "Start Vibing"}
          </Link>
          
          <Link href="/about" className="cyber-button-secondary text-lg px-8 py-4">
            Learn More
          </Link>
        </div>
        
        <div className="mt-12 flex gap-6">
          <div className="cyber-stat">
            <span className="text-3xl font-bold text-pink-600">10K+</span>
            <span className="text-gray-600">Daily Vibes</span>
          </div>
          <div className="cyber-stat">
            <span className="text-3xl font-bold text-cyan-600">5K+</span>
            <span className="text-gray-600">Users</span>
          </div>
          <div className="cyber-stat">
            <span className="text-3xl font-bold text-purple-600">50K+</span>
            <span className="text-gray-600">NFTs Created</span>
          </div>
        </div>
      </div>
      
      <VibePreview />
    </div>
  );

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

  // Features section component
  const FeaturesSection = () => {
    const features = [
      {
        icon: "🔗",
        title: "Connect",
        description: "Link your wallet and join the VibeZ community in seconds"
      },
      {
        icon: "✍️",
        title: "Create",
        description: "Share your daily vibe with text, emoji, and images"
      },
      {
        icon: "🏆",
        title: "Collect",
        description: "Build your streak and earn rewards for consistent vibing"
      }
    ];

    return (
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="cyber-feature">
              <div className="cyber-icon">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Footer component
  const Footer = () => (
    <footer className="mt-24 pt-12 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="cyber-logo-small mr-2">V</div>
          <span className="text-gray-700">VibeZ © 2025</span>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Twitter</a>
          <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Discord</a>
          <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">GitHub</a>
          <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Docs</a>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-purple-50 overflow-hidden relative">
      <BackgroundElements />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </div>
    </div>
  );
}
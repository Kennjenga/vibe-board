'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-white">
      {/* Subtle matte gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 247, 255, 1) 100%)',
          opacity: 0.9
        }}
      />

      {/* Scattered, soft circular spots of color */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 cyber-text">
              About Vibe Board
            </h1>
            <p className="text-xl text-gray-700">
              Express yourself. Mint the moment. Connect with others.
            </p>
          </motion.div>

          {/* Mission section */}
          <motion.section variants={itemVariants} className="cyber-panel mb-12">
            <h2 className="text-2xl font-bold mb-4 cyber-text">Our Mission</h2>
            <p className="text-lg mb-4 text-gray-700">
              Vibe Board was created with a simple mission: to give people a creative, fun way to express their daily mood and connect with others through shared emotions.
            </p>
            <p className="text-lg mb-4 text-gray-700">
              In a world where social media often feels curated and artificial, we wanted to build a platform that encourages authentic expression and genuine connection.
            </p>
            <p className="text-lg text-gray-700">
              By combining the expressive nature of emojis, the permanence of blockchain, and the creativity of digital art, we&apos;ve created a unique space for people to share their vibes.
            </p>
          </motion.section>

          {/* Features section */}
          <motion.section variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center cyber-text">Key Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "✨",
                  title: "Daily Vibes",
                  description: "Share your mood with a combination of emoji, color, and text that captures exactly how you're feeling."
                },
                {
                  icon: "🔗",
                  title: "Blockchain Powered",
                  description: "Your vibes are minted as NFTs on the blockchain, giving you true ownership of your digital expression."
                },
                {
                  icon: "🏆",
                  title: "Vibe Streaks",
                  description: "Build your streak by posting consistently and earn rewards for your dedication to the platform."
                }
              ].map((feature, i) => (
                <div key={i} className="cyber-panel p-6">
                  <div className="cyber-badge w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
                  <p className="text-center text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* How It Works Section */}
          <motion.section variants={itemVariants} className="cyber-panel mb-12">
            <h2 className="text-2xl font-bold mb-4 cyber-text">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div className="text-center">
                <div className="cyber-badge mx-auto mb-4">🔗</div>
                <h3 className="text-xl font-bold mb-2">Connect</h3>
                <p className="text-gray-700">Link your wallet and join the Vibe Board community in seconds. No lengthy sign-up process required.</p>
              </div>

              <div className="text-center">
                <div className="cyber-badge mx-auto mb-4">✍️</div>
                <h3 className="text-xl font-bold mb-2">Create</h3>
                <p className="text-gray-700">Share your daily vibe with text, emoji, and images. Each vibe is minted as a unique NFT on the blockchain.</p>
              </div>

              <div className="text-center">
                <div className="cyber-badge mx-auto mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">Collect</h3>
                <p className="text-gray-700">Build your streak and earn rewards for consistent vibing. Interact with others&apos; vibes by liking and sharing.</p>
              </div>
            </div>

            <p className="text-lg text-gray-700">
              Every vibe you create is stored on the blockchain, giving you true ownership of your content.
              You can share your vibes across social platforms, collect them as NFTs, and even trade them if you wish.
            </p>
          </motion.section>

          {/* Team section */}
          <motion.section variants={itemVariants} className="cyber-panel mb-12">
            <h2 className="text-2xl font-bold mb-4 cyber-text">Our Team</h2>
            <p className="text-lg mb-4 text-gray-700">
              We&apos;re a small team of designers, developers, and blockchain enthusiasts who believe in the power of self-expression and community.
            </p>
            <p className="text-lg text-gray-700">
              Our diverse backgrounds in art, technology, and social psychology have helped us create a platform that&apos;s both technically innovative and emotionally resonant.
            </p>
          </motion.section>

          {/* Contact section */}
          <motion.section variants={itemVariants} className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6 cyber-text">Get In Touch</h2>
            <p className="text-lg mb-8 text-gray-700">
              Have questions, suggestions, or just want to say hi? We&apos;d love to hear from you!
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="mailto:hello@vibeboard.com"
                className="cyber-button-primary"
              >
                Contact Us
              </a>
              <Link href="/vibes" className="cyber-button-secondary">
                Start Vibing
              </Link>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}

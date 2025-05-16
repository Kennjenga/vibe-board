'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  useCreateVibe,
  useGetLatestVibes,
  useGetPopularVibes,
  useGetVibe,
  useLikeVibe,
  useVibeStreak,
  useHasLiked
} from '@/blockchain/hooks/useVibeNFT';
import { ShareButtons } from '@/components/ShareButtons';
import { NewVibe, SAMPLE_COLORS, VibeView } from '@/types/vibe';
import EmojiPicker from '@/components/EmojiPicker';

export default function Home() {
  const { address } = useAccount();
  const [view, setView] = useState<VibeView>('latest');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string>('');
  const [newVibe, setNewVibe] = useState<NewVibe>({
    emoji: '😊',
    color: SAMPLE_COLORS[0],
    phrase: '',
    imageURI: ''
  });

  const { data: latestVibes, isLoading: loadingLatest } = useGetLatestVibes(10);
  const { data: popularVibes, isLoading: loadingPopular } = useGetPopularVibes(10);
  const { data: userStreak } = useVibeStreak(address || '0x0');
  const { createVibe } = useCreateVibe(
    newVibe.emoji,
    newVibe.color,
    newVibe.phrase,
    newVibe.imageURI
  );

  const handleCreateVibe = async () => {
    if (!newVibe.phrase) {
      setError('Please enter a vibe phrase');
      return;
    }

    setError('');
    setIsCreating(true);
    try {
      await createVibe();
      setNewVibe({
        emoji: '😊',
        color: SAMPLE_COLORS[0],
        phrase: '',
        imageURI: ''
      });
    } catch (error) {
      console.error('Error creating vibe:', error);
      setError('Failed to create vibe. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const isLoading = view === 'latest' ? loadingLatest : loadingPopular;
  const vibes = view === 'latest' ? latestVibes : popularVibes;

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="cyber-grid"></div>

      {/* Horizontal lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`line-h-${i}`}
          className="cyber-line"
          style={{
            top: `${20 + i * 15}%`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center cyber-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Vibes
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Vibes Feed (70%) */}
          <motion.div
            className="lg:w-8/12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200">
              <motion.button
                onClick={() => setView('latest')}
                className={`cyber-tab ${view === 'latest' ? 'cyber-tab-active' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Latest Vibes
              </motion.button>
              <motion.button
                onClick={() => setView('popular')}
                className={`cyber-tab ${view === 'popular' ? 'cyber-tab-active' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Popular Vibes
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="vibe-card animate-pulse"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                  >
                    <div className="h-48 bg-gray-100 rounded-lg"></div>
                    <div className="h-6 bg-gray-100 rounded mt-4 w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded mt-2 w-1/2"></div>
                  </motion.div>
                ))
              ) : vibes?.length === 0 ? (
                <motion.div
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-xl text-gray-500">No vibes yet. Be the first to share your vibe!</p>
                </motion.div>
              ) : (
                vibes?.map((tokenId, index) => (
                  <motion.div
                    key={tokenId.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <VibeCard tokenId={tokenId} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Right Column - Create Vibe & Streak (30%) */}
          <motion.div
            className="lg:w-4/12"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {address && (
              <motion.div
                className="cyber-panel mb-6"
                whileHover={{
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 229, 255, 0.2)",
                  y: -5
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="cyber-badge"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-lg font-bold">{userStreak?.toString() || '0'}</span>
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--neon-blue)" }}>Your Vibe Streak</h3>
                    <p className="text-sm text-gray-600">Keep sharing daily!</p>
                  </div>
                </div>
              </motion.div>
            )}

            {address && (
              <motion.div
                className="cyber-panel mb-6"
                whileHover={{
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 45, 189, 0.2)",
                  y: -5
                }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--neon-pink)" }}>Share Your Vibe</h2>
                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <input
                      type="text"
                      placeholder="Enter your vibe phrase..."
                      className={`w-full p-3 bg-white border rounded-lg transition-colors ${
                        error ? 'border-red-500' : 'border-blue-300 focus:border-blue-500'
                      }`}
                      value={newVibe.phrase}
                      onChange={(e) => {
                        setError('');
                        setNewVibe({ ...newVibe, phrase: e.target.value });
                      }}
                    />
                  </motion.div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex gap-4">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <EmojiPicker
                        selectedEmoji={newVibe.emoji}
                        onEmojiSelect={(emoji) => setNewVibe({ ...newVibe, emoji })}
                      />
                    </motion.div>
                    <div className="flex gap-2 flex-wrap">
                      {SAMPLE_COLORS.map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => setNewVibe({ ...newVibe, color })}
                          className={`w-8 h-8 rounded-full ${
                            newVibe.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-blue-500' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <motion.div
                        className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-300"
                        whileHover={{ borderColor: "var(--neon-blue)" }}
                      >
                        {newVibe.imageURI ? (
                          <>
                            <Image
                              src={newVibe.imageURI}
                              alt="Selected"
                              fill
                              className="object-cover"
                            />
                            <motion.button
                              onClick={() => setNewVibe({ ...newVibe, imageURI: '' })}
                              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                              whileHover={{ scale: 1.1 }}
                            >
                              ✕
                            </motion.button>
                          </>
                        ) : (
                          <motion.label
                            htmlFor="image-upload"
                            className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                          >
                            +
                          </motion.label>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          id="image-upload"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                setError('Image must be less than 5MB');
                                return;
                              }

                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('upload_preset', 'vibeboard');

                              try {
                                const response = await fetch(
                                  'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
                                  {
                                    method: 'POST',
                                    body: formData,
                                  }
                                );
                                const data = await response.json();
                                setNewVibe({ ...newVibe, imageURI: data.secure_url });
                                setError('');
                              } catch (error) {
                                console.error('Error uploading image:', error);
                                setError('Failed to upload image. Please try again.');
                              }
                            }
                          }}
                        />
                      </motion.div>
                    </div>

                    <div className="flex-grow">
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <input
                          type="url"
                          placeholder="Or paste image URL..."
                          className={`w-full p-3 bg-white border rounded-lg transition-colors text-sm ${
                            error && error.includes('image') ? 'border-red-500' : 'border-blue-300 focus:border-blue-500'
                          }`}
                          value={newVibe.imageURI}
                          onChange={(e) => {
                            setError('');
                            setNewVibe({ ...newVibe, imageURI: e.target.value });
                          }}
                        />
                      </motion.div>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload image (max 5MB) or provide URL
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleCreateVibe}
                    disabled={isCreating}
                    className={`cyber-button-primary w-full ${isCreating ? 'opacity-50 cursor-wait' : ''}`}
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 229, 255, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isCreating ? 'Creating...' : 'Share Vibe'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            <motion.div
              className="cyber-panel"
              whileHover={{
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 229, 255, 0.2)",
                y: -5
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--neon-blue)" }}>Trending Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['#cyberpunk', '#neon', '#future', '#tech', '#digital', '#vibe', '#mood'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="cyber-tag"
                    whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0, 229, 255, 0.2)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (i * 0.05) }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function VibeCard({ tokenId }: { tokenId: bigint }) {
  const { address } = useAccount();
  const { data: vibe, isLoading } = useGetVibe(tokenId);
  const { data: hasLiked } = useHasLiked(tokenId, address || '0x0');
  const { likeVibe } = useLikeVibe(tokenId);
  const [isLiking, setIsLiking] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  if (isLoading) {
    return (
      <div className="vibe-card animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded w-3/4"></div>
          <div className="aspect-video w-full bg-gray-100 rounded-lg"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 w-20 bg-gray-100 rounded"></div>
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vibe) return null;

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);
    try {
      await likeVibe();
    } catch (error) {
      console.error('Error liking vibe:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      className="vibe-card group"
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      } as React.CSSProperties}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <motion.div
          className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl flex-shrink-0"
          style={{
            backgroundColor: `${vibe.color}15`,
            border: `2px solid ${vibe.color}30`
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {vibe.emoji}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-xl font-bold truncate" style={{ color: vibe.color }}>
            {vibe.phrase}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            by {vibe.creator.slice(0, 6)}...{vibe.creator.slice(-4)}
          </p>
        </div>
      </div>

      <div className="aspect-video w-full rounded-lg mb-4 overflow-hidden">
        {vibe.imageURI ? (
          <div className="relative w-full h-full">
            <Image
              src={vibe.imageURI}
              alt={vibe.phrase}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            className="w-full h-full transition-all group-hover:brightness-110"
            style={{
              backgroundColor: vibe.color,
              backgroundImage: `linear-gradient(135deg,
                ${vibe.color}22 0%,
                ${vibe.color}44 25%,
                ${vibe.color}66 50%,
                ${vibe.color}44 75%,
                ${vibe.color}22 100%
              )`
            }}
          >
            <div className="w-full h-full opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)]" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <motion.button
            onClick={handleLike}
            className={`cyber-like-button relative overflow-hidden
              ${hasLiked ? 'cyber-liked' : ''}
              ${isLiking ? 'cursor-wait opacity-70' : ''}
              px-4 py-2 text-sm font-medium rounded-md
            `}
            disabled={hasLiked || isLiking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {hasLiked ? '❤️' : isLiking ? '...' : '♡'} {vibe.likes.toString()}
            </span>
          </motion.button>
          <ShareButtons
            url={`https://vibe-board.com/vibe/${tokenId.toString()}`}
            title={`Check out this vibe by ${vibe.creator.slice(0, 6)}...${vibe.creator.slice(-4)}`}
            text={`${vibe.emoji} ${vibe.phrase} ${vibe.emoji}`}
          />
        </div>
        <motion.div
          className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
          whileHover={{ scale: 1.05, backgroundColor: "#f0f9ff" }}
        >
          {new Date(Number(vibe.timestamp) * 1000).toLocaleDateString()}
        </motion.div>
      </div>
    </motion.div>
  );
}
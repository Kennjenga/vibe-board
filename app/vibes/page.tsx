'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import Image from 'next/image';
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
  const [activeImageTab, setActiveImageTab] = useState<'ai' | 'upload'>('ai');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<{ url: string; type: 'image' | 'gif' } | null>(null);
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

    // If there's a preview image but no selected image, ask user to confirm
    if (previewImage && !newVibe.imageURI) {
      if (window.confirm('Do you want to use the preview image for your vibe?')) {
        // Update the vibe with the preview image
        setNewVibe(prev => ({ ...prev, imageURI: previewImage.url }));
      } else {
        setError('Please select an image for your vibe');
        return;
      }
    }

    if (!previewImage && !newVibe.imageURI) {
      setError('Please add an image to your vibe');
      return;
    }

    setError('');
    setIsCreating(true);
    try {
      // Call createVibe function to create the vibe
      await createVibe();

      // Reset form
      setNewVibe({
        emoji: '😊',
        color: SAMPLE_COLORS[0],
        phrase: '',
        imageURI: ''
      });
      setPreviewImage(null);
      setImagePrompt('');
      setImageUrlInput('');
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
      {/* Subtle matte gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 247, 255, 1) 100%)',
          opacity: 0.9,
          zIndex: 0
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
                mixBlendMode: 'multiply', // Softer blend mode
                zIndex: 0
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center cyber-text">Explore Vibes</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Vibes Feed (70%) */}
          <div className="lg:w-8/12">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setView('latest')}
                className={`cyber-tab ${view === 'latest' ? 'cyber-tab-active' : ''}`}
              >
                Latest Vibes
              </button>
              <button
                onClick={() => setView('popular')}
                className={`cyber-tab ${view === 'popular' ? 'cyber-tab-active' : ''}`}
              >
                Popular Vibes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="vibe-card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                  </div>
                ))
              ) : vibes?.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-500">No vibes yet. Be the first to share your vibe!</p>
                </div>
              ) : (
                vibes?.map((tokenId) => (
                  <VibeCard key={tokenId.toString()} tokenId={tokenId} />
                ))
              )}
            </div>
          </div>

          {/* Right Column - Create Vibe & Streak (30%) */}
          <div className="lg:w-4/12">
            {address && (
              <div className="cyber-panel mb-6">
                <div className="flex items-center gap-3">
                  <div className="cyber-badge">
                    <span className="text-lg font-bold">{userStreak?.toString() || '0'}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-800">Your Vibe Streak</h3>
                    <p className="text-sm text-gray-600">Keep sharing daily!</p>
                  </div>
                </div>
              </div>
            )}

            {address && (
              <div className="cyber-panel mb-6">
                <h2 className="text-xl font-bold mb-4 text-pink-600">Share Your Vibe</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your vibe phrase..."
                    className={`w-full p-3 bg-white border rounded-lg transition-colors ${
                      error ? 'border-red-500' : 'border-purple-300 focus:border-pink-500'
                    }`}
                    value={newVibe.phrase}
                    onChange={(e) => {
                      setError('');
                      setNewVibe({ ...newVibe, phrase: e.target.value });
                    }}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex gap-4">
                    <EmojiPicker
                      selectedEmoji={newVibe.emoji}
                      onEmojiSelect={(emoji) => setNewVibe({ ...newVibe, emoji })}
                    />
                    <div className="flex gap-2 flex-wrap">
                      {SAMPLE_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewVibe({ ...newVibe, color })}
                          className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                            newVibe.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-pink-500' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className={`relative aspect-video w-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      previewImage?.url || newVibe.imageURI
                        ? 'bg-gray-100 border-[#7928CA]/40 shadow-lg'
                        : 'bg-gray-50 border-dashed border-gray-300 hover:border-[#7928CA]/30'
                    }`}>
                      {previewImage?.url ? (
                        <>
                          <Image
                            src={previewImage.url}
                            alt={`Preview ${previewImage.type}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setPreviewImage(null)}
                              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors"
                              title="Remove image"
                            >
                              ✕
                            </button>
                            {/* Use image button */}
                            <button
                              onClick={() => {
                                setNewVibe({ ...newVibe, imageURI: previewImage.url });
                                setPreviewImage(null);
                              }}
                              className="absolute bottom-2 right-2 bg-[#7928CA]/80 text-white py-1 px-3 rounded-full text-sm font-medium hover:bg-[#7928CA] transition-colors"
                            >
                              Use this image
                            </button>
                          </div>
                        </>
                      ) : newVibe.imageURI ? (
                        <>
                          <Image
                            src={newVibe.imageURI}
                            alt="Selected Vibe Image"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setNewVibe({ ...newVibe, imageURI: '' })}
                              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors"
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 mb-3 rounded-full bg-[#7928CA]/10 flex items-center justify-center">
                            <span className="text-2xl">{newVibe.emoji || '🖼️'}</span>
                          </div>
                          <p className="text-gray-500 mb-1">Add an image to your vibe</p>
                          <p className="text-xs text-gray-400">Generate with AI or upload your own</p>
                        </div>
                      )}
                    </div>

                    {/* Tabs for Image Options */}
                    <div className="border-b border-gray-200">
                      <ul className="flex -mb-px">
                        <li className="mr-1 flex-1">
                          <button
                            onClick={() => {
                              setActiveImageTab('ai');
                              setError('');
                            }}
                            className={`inline-block w-full py-2 px-1 text-center border-b-2 transition-colors ${
                              activeImageTab === 'ai'
                                ? 'border-[#7928CA] text-[#7928CA] font-medium'
                                : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            AI Generation
                          </button>
                        </li>
                        <li className="flex-1">
                          <button
                            onClick={() => {
                              setActiveImageTab('upload');
                              setError('');
                            }}
                            className={`inline-block w-full py-2 px-1 text-center border-b-2 transition-colors ${
                              activeImageTab === 'upload'
                                ? 'border-[#7928CA] text-[#7928CA] font-medium'
                                : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Upload
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Content based on active tab */}
                    <div className="space-y-3">
                      {/* AI Image Generation Tab */}
                      {activeImageTab === 'ai' && (
                        <div className="flex flex-col gap-3">
                          {/* Custom Prompt Input */}
                          <div>
                            <label htmlFor="image-prompt" className="block text-sm font-medium text-gray-700 mb-1">
                              Image Generation Prompt
                            </label>
                            <textarea
                              id="image-prompt"
                              rows={2}
                              placeholder="Describe the image you want to generate..."
                              className="cyber-input w-full p-3 text-sm"
                              value={imagePrompt}
                              onChange={(e) => setImagePrompt(e.target.value)}
                            />
                            <div className="flex justify-between mt-1">
                              <p className="text-xs text-gray-500">
                                Be descriptive for better results
                              </p>
                              <button
                                className="text-xs text-purple-600 hover:text-purple-800"
                                onClick={() => setImagePrompt(`A vibrant, artistic image that represents the feeling: "${newVibe.phrase}" with ${newVibe.emoji} emoji. Use ${newVibe.color} as the primary color.`)}
                              >
                                Use vibe details
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={async () => {
                                if (!imagePrompt.trim()) {
                                  setError('Please enter an image prompt first');
                                  return;
                                }

                                setError('');
                                setIsCreating(true);
                                setPreviewImage(null);

                                try {
                                  const response = await fetch('/api/generate-image', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      prompt: imagePrompt,
                                      type: 'image'
                                    }),
                                  });

                                  const data = await response.json();
                                  if (!response.ok) {
                                    throw new Error(data.error || 'Failed to generate image');
                                  }

                                  // Store the image URL in previewImage instead of newVibe.imageURI
                                  setPreviewImage({
                                    url: data.imageURI,
                                    type: 'image'
                                  });
                                } catch (error) {
                                  console.error('Error generating image:', error);
                                  setError(error instanceof Error ? error.message : 'Failed to generate image. Please try again.');
                                } finally {
                                  setIsCreating(false);
                                }
                              }}
                              disabled={isCreating || !imagePrompt.trim()}
                              className={`cyber-button flex-1 ${isCreating ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              <span className="flex items-center justify-center gap-2">
                                <span className="text-lg">🎨</span>
                                <span>{isCreating ? 'Generating...' : 'Generate Image'}</span>
                              </span>
                            </button>

                            <button
                              onClick={async () => {
                                if (!imagePrompt.trim()) {
                                  setError('Please enter an image prompt first');
                                  return;
                                }

                                setError('');
                                setIsCreating(true);
                                setPreviewImage(null);

                                try {
                                  const response = await fetch('/api/generate-image', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      prompt: imagePrompt,
                                      type: 'gif'
                                    }),
                                  });

                                  const data = await response.json();
                                  if (!response.ok) {
                                    throw new Error(data.error || 'Failed to generate GIF');
                                  }

                                  // Store the image URL in previewImage instead of newVibe.imageURI
                                  setPreviewImage({
                                    url: data.imageURI,
                                    type: 'gif'
                                  });
                                } catch (error) {
                                  console.error('Error generating GIF:', error);
                                  setError(error instanceof Error ? error.message : 'Failed to generate GIF. Please try again.');
                                } finally {
                                  setIsCreating(false);
                                }
                              }}
                              disabled={isCreating || !imagePrompt.trim()}
                              className={`cyber-button flex-1 ${isCreating ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              <span className="flex items-center justify-center gap-2">
                                <span className="text-lg">✨</span>
                                <span>{isCreating ? 'Generating...' : 'Generate GIF'}</span>
                              </span>
                            </button>
                          </div>

                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm mt-2">
                            <p className="text-purple-700 font-medium mb-1">How it works:</p>
                            <ol className="text-purple-600 text-xs space-y-1 list-decimal pl-4">
                              <li>Enter a detailed prompt describing the image you want</li>
                              <li>Click &quot;Generate Image&quot; or &quot;Generate GIF&quot;</li>
                              <li>AI will create a unique visual based on your prompt</li>
                              <li>The image will be shown in the preview above</li>
                              <li>The image will be uploaded when you share your vibe</li>
                            </ol>
                          </div>
                        </div>
                      )}

                      {/* Upload Tab */}
                      {activeImageTab === 'upload' && (
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <label
                              htmlFor="image-upload"
                              className="cyber-button flex-1 text-center cursor-pointer"
                            >
                              <span className="flex items-center justify-center gap-2">
                                <span className="text-lg">📁</span>
                                <span>Upload Image</span>
                              </span>
                            </label>
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

                                  // Show loading state
                                  setError('');
                                  setIsCreating(true);
                                  setPreviewImage(null);

                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    const response = await fetch('/api/upload-image', {
                                      method: 'POST',
                                      body: formData,
                                    });

                                    const data = await response.json();
                                    if (!response.ok) {
                                      throw new Error(data.error || 'Failed to upload image');
                                    }

                                    // Set as preview image instead of directly to newVibe
                                    setPreviewImage({
                                      url: data.imageURI,
                                      type: 'image'
                                    });
                                    setError('');
                                  } catch (error) {
                                    console.error('Error uploading image:', error);
                                    setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
                                  } finally {
                                    setIsCreating(false);
                                  }
                                }
                              }}
                            />
                          </div>

                          <div className="relative">
                            <input
                              type="url"
                              placeholder="Or paste image URL here..."
                              className={`cyber-input w-full p-3 text-sm pr-16 ${
                                error && error.includes('image') ? 'border-red-500' : ''
                              }`}
                              value={imageUrlInput}
                              onChange={(e) => {
                                setError('');
                                setImageUrlInput(e.target.value);
                              }}
                              onBlur={async (e) => {
                                const url = e.target.value.trim();
                                if (url && url.startsWith('http') && !url.startsWith('https://res.cloudinary.com/')) {
                                  // If it's a URL but not already a Cloudinary URL, upload it to Cloudinary
                                  setIsCreating(true);
                                  setPreviewImage(null);

                                  try {
                                    const response = await fetch('/api/upload-image', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({ url }),
                                    });

                                    const data = await response.json();
                                    if (!response.ok) {
                                      throw new Error(data.error || 'Failed to upload image');
                                    }

                                    // Set as preview image instead of directly to newVibe
                                    setPreviewImage({
                                      url: data.imageURI,
                                      type: 'image'
                                    });
                                    setImageUrlInput(''); // Clear the input after successful upload
                                  } catch (error) {
                                    console.error('Error uploading image URL:', error);
                                    setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
                                  } finally {
                                    setIsCreating(false);
                                  }
                                }
                              }}
                            />
                            {isCreating && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin h-5 w-5 border-2 border-[#7928CA] border-t-transparent rounded-full"></div>
                              </div>
                            )}
                          </div>

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                            <p className="text-blue-700 font-medium mb-1">Upload requirements:</p>
                            <ul className="text-blue-600 text-xs space-y-1 list-disc pl-4">
                              <li>Maximum file size: 5MB</li>
                              <li>Supported formats: JPG, PNG, GIF, WebP</li>
                              <li>Recommended aspect ratio: 16:9</li>
                              <li>Images will be shown in the preview above</li>
                              <li>Click &quot;Use this image&quot; to select it for your vibe</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCreateVibe}
                    disabled={isCreating || !newVibe.phrase || (!previewImage && !newVibe.imageURI)}
                    className={`cyber-button-primary w-full ${isCreating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {isCreating ? 'Creating...' : 'Share Vibe'}
                  </button>
                </div>
              </div>
            )}

            <div className="cyber-panel">
              <h2 className="text-xl font-bold mb-4 text-cyan-600">Trending Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['#cyberpunk', '#neon', '#future', '#tech', '#digital', '#vibe', '#mood'].map(tag => (
                  <span key={tag} className="cyber-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
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

  if (isLoading) {
    return (
      <div className="vibe-card animate-pulse backdrop-blur-sm bg-white/30 border-2 border-[#7928CA]/20 rounded-xl p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200/50 rounded w-3/4"></div>
          <div className="aspect-video w-full bg-gray-200/50 rounded-lg"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 w-20 bg-gray-200/50 rounded"></div>
            <div className="h-4 w-32 bg-gray-200/50 rounded"></div>
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
    <div className="vibe-card group backdrop-blur-sm bg-white/80 border-2 border-[var(--neon-blue)]/20 rounded-xl p-6 transition-all hover:border-[var(--neon-blue)]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
      {/* Card header with emoji and phrase */}
      <div className="flex items-start gap-4 mb-4 relative">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110 flex-shrink-0"
          style={{
            backgroundColor: `${vibe.color}15`,
            border: `2px solid ${vibe.color}30`
          }}
        >
          {vibe.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate" style={{ color: vibe.color }}>
            {vibe.phrase}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            by {vibe.creator.slice(0, 6)}...{vibe.creator.slice(-4)}
          </p>
        </div>

        {/* Share button positioned to the right */}
        <div className="absolute right-0 top-0 z-20">
          <ShareButtons
            url={`https://vibe-board.com/vibe/${tokenId.toString()}`}
            title={`Check out this vibe by ${vibe.creator.slice(0, 6)}...${vibe.creator.slice(-4)}`}
            text={`${vibe.emoji} ${vibe.phrase} ${vibe.emoji}`}
          />
        </div>
      </div>

      {/* Vibe image or color background */}
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

      {/* Card footer with like button */}
      <div className="flex justify-between items-center pt-3 mt-3 border-t border-[var(--neon-blue)]/10">
        <button
          onClick={handleLike}
          className={`cyber-like-button relative overflow-hidden
            ${hasLiked ? 'cyber-liked' : ''}
            ${isLiking ? 'cursor-wait opacity-70' : ''}
            px-4 py-2 text-sm font-medium rounded-xl
            border border-[var(--neon-blue)]/30 hover:border-[var(--neon-blue)]
            bg-gradient-to-r from-[var(--neon-blue)]/10 to-[var(--neon-purple)]/10
            hover:from-[var(--neon-blue)]/20 hover:to-[var(--neon-purple)]/20
            transition-all duration-300
          `}
          disabled={hasLiked || isLiking}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">{hasLiked ? '❤️' : isLiking ? '...' : '♡'}</span>
            <span className="font-semibold">{vibe.likes.toString()}</span>
          </span>
        </button>

        <time className="text-sm text-gray-500 font-medium">
          {new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </time>
      </div>
    </div>
  );
}
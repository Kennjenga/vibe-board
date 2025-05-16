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
    <main className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-4xl font-bold mb-8 text-center cyber-text">CyberVibe</h1> */}
        
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

                  {/* Image Upload */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border-2 border-[#7928CA]/20">
                        {newVibe.imageURI ? (
                          <>
                            <Image
                              src={newVibe.imageURI}
                              alt="Selected"
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => setNewVibe({ ...newVibe, imageURI: '' })}
                              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <label
                            htmlFor="image-upload"
                            className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-[#7928CA]/10 transition-colors"
                          >
                            +
                          </label>
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
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <input
                        type="url"
                        placeholder="Or paste image URL..."
                        className={`w-full p-3 bg-white border rounded-lg transition-colors text-sm ${
                          error && error.includes('image') ? 'border-red-500' : 'border-purple-300 focus:border-pink-500'
                        }`}
                        value={newVibe.imageURI}
                        onChange={(e) => {
                          setError('');
                          setNewVibe({ ...newVibe, imageURI: e.target.value });
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Upload image (max 5MB) or provide URL
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCreateVibe}
                    disabled={isCreating}
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
    <div className="vibe-card group backdrop-blur-sm bg-white/30 border-2 border-[#7928CA]/20 rounded-xl p-6 transition-all hover:border-[#7928CA]/40 hover:shadow-[0_0_15px_rgba(121,40,202,0.2)]">
      <div className="flex items-start gap-3 mb-4">
        <p className="text-xl font-bold flex-grow" style={{ color: vibe.color }}>
          {vibe.phrase}
        </p>
        <span className="text-2xl transition-transform group-hover:scale-110 flex-shrink-0">{vibe.emoji}</span>
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
          <button
            onClick={handleLike}
            className={`cyber-like-button relative overflow-hidden
              ${hasLiked ? 'cyber-liked' : ''} 
              ${isLiking ? 'cursor-wait opacity-70' : ''}
              px-4 py-2 text-sm font-medium rounded-md
              border border-[#7928CA]/30 hover:border-[#7928CA]
              bg-gradient-to-r from-[#7928CA]/10 to-[#FF0080]/10
              hover:from-[#7928CA]/20 hover:to-[#FF0080]/20
              transition-all duration-300
            `}
            disabled={hasLiked || isLiking}
          >
            <span className="relative z-10">
              {hasLiked ? '❤️' : isLiking ? '...' : '♡'} {vibe.likes.toString()}
            </span>
          </button>
          <ShareButtons 
            url={`https://vibe-board.com/vibe/${tokenId.toString()}`} // This should be configurable via environment variable
            title={`Check out this vibe by ${vibe.creator.slice(0, 6)}...${vibe.creator.slice(-4)}`}
            text={`${vibe.emoji} ${vibe.phrase} ${vibe.emoji}`}
          />
        </div>
        <span className="text-sm text-gray-600 font-medium">
          by {vibe.creator.slice(0, 6)}...{vibe.creator.slice(-4)}
        </span>
      </div>
    </div>
  );
}
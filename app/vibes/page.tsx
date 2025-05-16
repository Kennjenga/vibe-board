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

  // Pagination state
  const VIBES_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: latestVibes, isLoading: loadingLatest } = useGetLatestVibes(VIBES_PER_PAGE * currentPage);
  const { data: popularVibes, isLoading: loadingPopular } = useGetPopularVibes(VIBES_PER_PAGE * currentPage);
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
  const allVibes = view === 'latest' ? latestVibes : popularVibes;

  // Calculate total pages and current page vibes
  const totalVibes = allVibes?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalVibes / VIBES_PER_PAGE));

  // Get current page vibes
  const startIndex = (currentPage - 1) * VIBES_PER_PAGE;
  const endIndex = Math.min(startIndex + VIBES_PER_PAGE, totalVibes);
  const currentVibes = allVibes?.slice(startIndex, endIndex);

  // Handle page changes
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Vibes Feed (70%) */}
          <div className="lg:w-8/12">
            <div className="flex justify-center gap-6 mb-10">
              <button
                onClick={() => setView('latest')}
                className={`px-8 py-3 font-medium rounded-lg transition-all ${
                  view === 'latest'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform -translate-y-1'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <span>Latest Vibes</span>
                </span>
              </button>
              <button
                onClick={() => setView('popular')}
                className={`px-8 py-3 font-medium rounded-lg transition-all ${
                  view === 'popular'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform -translate-y-1'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span>Popular Vibes</span>
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="vibe-card animate-pulse bg-white/80 shadow-sm border border-gray-100 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="aspect-video w-full bg-gray-200 rounded-lg mb-3"></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : allVibes?.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-500">No vibes yet. Be the first to share your vibe!</p>
                </div>
              ) : (
                currentVibes?.map((tokenId) => (
                  <VibeCard key={tokenId.toString()} tokenId={tokenId} />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && allVibes && allVibes.length > VIBES_PER_PAGE && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  Previous
                </button>

                <div className="px-4 py-2 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Create Vibe & Streak (30%) */}
          <div className="lg:w-4/12">
            {address && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    {userStreak?.toString() || '0'}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Your Vibe Streak</h3>
                    <p className="text-sm text-gray-500">Keep sharing daily!</p>
                  </div>
                </div>
              </div>
            )}

            {address && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-medium mb-4 text-gray-800">Share Your Vibe</h2>
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

                  {/* Emoji Selector */}
                  <EmojiPicker
                    selectedEmoji={newVibe.emoji}
                    onEmojiSelect={(emoji) => setNewVibe({ ...newVibe, emoji })}
                  />

                  {/* Color Selector */}
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewVibe({ ...newVibe, color })}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          newVibe.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Image Section */}
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className={`relative aspect-video w-full rounded-lg overflow-hidden border transition-all duration-300 ${
                      previewImage?.url || newVibe.imageURI
                        ? 'bg-gray-100 border-gray-200 shadow-sm'
                        : 'bg-gray-50 border-dashed border-gray-300 hover:border-gray-400'
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
                              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-blue-500"
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
                              className={`flex-1 py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isCreating ? 'opacity-50 cursor-wait' : ''}`}
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
                              className={`flex-1 py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isCreating ? 'opacity-50 cursor-wait' : ''}`}
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
                              className="flex-1 py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center cursor-pointer"
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
                              className={`w-full p-3 text-sm pr-16 border rounded-lg ${
                                error && error.includes('image') ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
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
                    className={`w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all ${
                      isCreating || !newVibe.phrase || (!previewImage && !newVibe.imageURI)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:from-purple-600 hover:to-pink-600'
                    }`}
                  >
                    {isCreating ? 'Creating...' : 'Share Vibe'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4 text-gray-800">Trending Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['#cyberpunk', '#neon', '#future', '#tech', '#digital', '#vibe', '#mood'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">{tag}</span>
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
      <div className="vibe-card animate-pulse bg-white/80 shadow-sm border border-gray-100 rounded-lg p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="aspect-video w-full bg-gray-200 rounded-lg mb-3"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
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
    <div className="vibe-card bg-white shadow-sm border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Card header with phrase and creator */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-medium text-gray-800">{vibe.phrase}</h3>
          <p className="text-xs text-gray-500">
            by {vibe.creator.slice(0, 6)}...{vibe.creator.slice(-4)}
          </p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xl">{vibe.emoji}</span>
        </div>
      </div>

      {/* Vibe image */}
      <div className="aspect-video w-full rounded-lg mb-3 overflow-hidden">
        {vibe.imageURI ? (
          <div className="relative w-full h-full">
            <Image
              src={vibe.imageURI}
              alt={vibe.phrase}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: vibe.color || '#f0f0f0'
            }}
          />
        )}
      </div>

      {/* Card footer with like button and date */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-gray-600 hover:text-pink-500 ${hasLiked ? 'text-pink-500' : ''}`}
          disabled={hasLiked || isLiking}
        >
          <span>{hasLiked ? '❤️' : isLiking ? '...' : '♡'}</span>
          <span>{vibe.likes.toString()}</span>
        </button>

        <time className="text-xs text-gray-500">
          {new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </time>
      </div>
    </div>
  );
}
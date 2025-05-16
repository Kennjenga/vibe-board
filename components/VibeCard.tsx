"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGetVibe, useHasLiked, useLikeVibe } from '@/blockchain/hooks/useVibeNFT';
import { ShareButtons } from './ShareButtons';
import { timeAgo, truncateAddress } from '@/utils/formatting';

export interface VibeData {
  id: bigint;
  creator: `0x${string}`;
  emoji: string;
  phrase: string;
  imageURI?: string;
  color?: string;
  timestamp: bigint;
  likes: bigint;
}

interface VibeCardProps {
  tokenId: bigint;
}

export function VibeCard({ tokenId }: VibeCardProps) {
  const { address } = useAccount();
  const { data: vibeResult, isLoading: isLoadingVibe, error: vibeError } = useGetVibe(tokenId);

  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  const { likeVibe: likeVibeFunction } = useLikeVibe(tokenId);
  const { data: hasLiked, isLoading: isLoadingHasLiked } = useHasLiked(tokenId, address || '0x0');

  if (isLoadingVibe) {
    return (
      <div className="vibe-card animate-pulse backdrop-blur-sm bg-white/30 border-2 border-[#7928CA]/20 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 bg-gray-200/50 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200/50 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200/50 rounded w-1/2 mt-2"></div>
            </div>
          </div>
          <div className="aspect-video w-full bg-gray-200/50 rounded-lg"></div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200/30">
            <div className="h-8 w-20 bg-gray-200/50 rounded"></div>
            <div className="h-4 w-32 bg-gray-200/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (vibeError) {
    return <div className="vibe-card text-red-500 p-4">Error loading vibe: {vibeError.message}</div>;
  }

  if (!vibeResult) {
    return <div className="vibe-card text-gray-500 p-4">Vibe not found.</div>;
  }

  const vibe: VibeData = {
    id: tokenId,
    creator: vibeResult.creator,
    emoji: vibeResult.emoji,
    phrase: vibeResult.phrase,
    imageURI: vibeResult.imageURI,
    color: vibeResult.color,
    timestamp: vibeResult.timestamp,
    likes: vibeResult.likes,
  };

  const handleLike = async () => {
    if (!address) {
      alert("Please connect your wallet to like vibes.");
      return;
    }
    if (!likeVibeFunction) {
      setLikeError("Like functionality is not available.");
      return;
    }
    setIsLiking(true);
    setLikeError(null);
    try {
      await likeVibeFunction();
    } catch (e: unknown) {
      console.error("Failed to like vibe:", e);
      if (e instanceof Error) {
        setLikeError(e.message || "Failed to like vibe.");
      } else {
        setLikeError("Failed to like vibe.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/vibe/${vibe.id.toString()}` : '';
  const shareTitle = `Check out this vibe by ${truncateAddress(vibe.creator)}`;
  const shareText = `${vibe.emoji} ${vibe.phrase}`;

  return (
    <div className="vibe-card bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-5 border border-purple-200/60 hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{vibe.emoji}</span>
            <div>
              <p className="font-semibold text-lg leading-tight" style={{ color: vibe.color || '#333333' }}>
                {vibe.phrase}
              </p>
              <p className="text-xs text-gray-500">
                By: <span className="font-medium text-purple-600 hover:underline cursor-pointer">{truncateAddress(vibe.creator)}</span>
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(Number(vibe.timestamp))}</span>
        </div>

        {vibe.imageURI && vibe.imageURI.startsWith('http') && (
          <div className="my-3 rounded-lg overflow-hidden border border-gray-200 aspect-video relative bg-gray-100">
            <Image
              src={vibe.imageURI}
              alt={`Vibe image for "${vibe.phrase}"`}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-300"
              unoptimized={vibe.imageURI.endsWith('.gif')}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-purple-200/40">
        <div className="flex items-center justify-between text-gray-600">
          <button
            onClick={handleLike}
            disabled={isLiking || hasLiked || isLoadingHasLiked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors 
                        ${hasLiked ? 'text-pink-500 bg-pink-100/80' : 'hover:bg-pink-50 text-gray-500'}
                        ${isLiking || isLoadingHasLiked ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isLoadingHasLiked ? 'Checking...' : (hasLiked ? '♥ Liked' : '♡ Like')}
            <span className="font-medium">{vibe.likes.toString()}</span>
          </button>
          <ShareButtons url={shareUrl} title={shareTitle} text={shareText} />
        </div>
        {likeError && <p className="text-xs text-red-500 mt-1">Error: {likeError.substring(0,100)}</p>}
      </div>
    </div>
  );
}
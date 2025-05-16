
import { useState } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useGetVibe, useHasLiked, useLikeVibe } from '@/blockchain/hooks/useVibeNFT';
import { ShareButtons } from './ShareButtons';

interface VibeCardProps {
  tokenId: bigint;
}

export function VibeCard({ tokenId }: VibeCardProps) {
  const { address } = useAccount();
  const { data: vibe, isLoading } = useGetVibe(tokenId);
  const { data: hasLiked } = useHasLiked(tokenId, address || '0x0');
  const { likeVibe } = useLikeVibe(tokenId);
  const [isLiking, setIsLiking] = useState(false);

  // Add mouse movement effect for enhanced hover experience
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

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

  const shareUrl = `https://vibe-board.com/vibe/${tokenId.toString()}`;
  const shareTitle = `Check out this vibe by ${vibe.creator.slice(0, 6)}...${vibe.creator.slice(-4)}`;
  const shareText = `${vibe.emoji} ${vibe.phrase} ${vibe.emoji}`;
  return (
    <div
      className="vibe-card group backdrop-blur-sm bg-white/30 border-2 border-[var(--neon-blue)]/20 rounded-xl p-6 transition-all hover:border-[var(--neon-blue)]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
      onMouseMove={handleMouseMove}
    >
      <div className="relative">
        {/* Share button positioned absolutely */}
        <div className="absolute right-0 top-0">
          <ShareButtons
            url={shareUrl}
            title={shareTitle}
            text={shareText}
          />
        </div>

        {/* Main header content */}
        <div className="flex items-start gap-4 mb-4 pr-12">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110 flex-shrink-0"
            style={{
              backgroundColor: `${vibe.color}15`,
              border: `2px solid ${vibe.color}30`
            }}
          >
            {vibe.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold truncate" style={{ color: vibe.color }}>
              {vibe.phrase}
            </p>
            <p className="text-sm text-gray-600 mt-1.5">
              by {vibe.creator.slice(0, 6)}...{vibe.creator.slice(-4)}
            </p>
          </div>
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

      {/* Card footer with like button and date */}
      <footer className="flex justify-between items-center pt-4 mt-4 border-t border-[var(--neon-blue)]/10">
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
      </footer>
    </div>
  );
}
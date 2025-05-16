import { useState, useRef, useEffect } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  text: string;
}

export function ShareButtons({ url, title, text }: ShareButtonsProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareUrls = {
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Copy to clipboard fallback
      try {
        await navigator.clipboard.writeText(url);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="cyber-share-button relative"
        title="Share"
      >
        ⎋
        {showTooltip && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Link copied!
          </span>
        )}
      </button>
        {isMenuOpen && (
        <div className="absolute top-full right-0 mt-1 backdrop-blur-md bg-white/90 border border-[#7928CA]/30 rounded-lg shadow-lg p-1 z-[60]">
          <div className="flex items-center gap-1">
            {typeof navigator.share === 'function' && (
              <button
                onClick={() => {
                  handleShare();
                  setIsMenuOpen(false);
                }}
                className="cyber-share-menu-icon"
                title="Share via Device"
              >
                📱
              </button>
            )}
            <button
              onClick={() => {
                window.open(shareUrls.x, '_blank');
                setIsMenuOpen(false);
              }}
              className="cyber-share-menu-icon"
              title="Share on X"
            >
              𝕏
            </button>
            <button
              onClick={() => {
                window.open(shareUrls.facebook, '_blank');
                setIsMenuOpen(false);
              }}
              className="cyber-share-menu-icon"
              title="Share on Facebook"
            >
              f
            </button>
            <button
              onClick={() => {
                window.open(shareUrls.linkedin, '_blank');
                setIsMenuOpen(false);
              }}
              className="cyber-share-menu-icon"
              title="Share on LinkedIn"
            >
              in
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(url);
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2000);
                setIsMenuOpen(false);
              }}
              className="cyber-share-menu-icon"
              title="Copy Link"
            >
              📋
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

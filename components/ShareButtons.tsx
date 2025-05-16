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

  // Function to handle download of vibe image
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibe-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative z-20" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="cyber-share-button relative"
        title="Share"
      >
        ⎋
        {showTooltip && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
            Link copied!
          </span>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-1 backdrop-blur-md bg-white/90 border border-[var(--neon-blue)]/30 rounded-lg shadow-lg p-2 z-30">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 border-b border-[var(--neon-blue)]/20 pb-2">
              <span className="text-xs text-gray-500">Share via:</span>
            </div>

            <div className="flex items-center gap-2">
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
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--neon-blue)]/20 pt-2">
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
              <button
                onClick={handleDownload}
                className="cyber-share-menu-icon"
                title="Download Vibe"
              >
                💾
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

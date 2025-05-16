import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-[var(--neon-blue)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold glow-text" style={{ color: 'var(--neon-blue)' }}>
            VIBE BOARD
          </h1>
        </div>
        <ConnectButton label="Log in" />
      </div>
    </nav>
  );
}

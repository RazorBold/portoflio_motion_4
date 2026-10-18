import { motion } from 'motion/react';
import Navbar from './Navbar';
import HeroBadge from './HeroBadge';
import BottomLeftCard from './BottomLeftCard';
import BottomRightCorner from './BottomRightCorner';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onBookDemo: () => void;
  walletAddress: string | null;
  onOpenWallet: () => void;
}

export default function Hero({ onBookDemo, walletAddress, onOpenWallet }: HeroProps) {
  const handleScrollDown = () => {
    const el = document.querySelector('#metrics');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0]">
      <section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
            type="video/mp4"
          />
        </video>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
          <Navbar
            onBookDemo={onBookDemo}
            walletAddress={walletAddress}
            onOpenWallet={onOpenWallet}
          />

          {/* Text Container */}
          <div className="w-full flex flex-col items-center pt-8 px-6 text-center max-w-4xl">
            <HeroBadge />
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#5E6470] mb-2 tracking-tight leading-[1.05]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fluid Asset Streams
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base md:text-lg text-[#5E6470] opacity-80 leading-relaxed max-w-xl font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Access Smart Vaults, stake RIVR, NFTs, transform rigid holdings into liquid cash instantly.
            </motion.p>
          </div>

          {/* Scroll Down Cue */}
          <button
            onClick={handleScrollDown}
            className="hidden sm:flex flex-col items-center gap-1 text-[rgba(30,50,90,0.6)] hover:text-[rgba(30,50,90,0.95)] transition-colors mb-6 cursor-pointer"
          >
            <span className="text-[11px] font-mono tracking-wider uppercase">Explore 3D Reactor & Streams</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>

          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  );
}

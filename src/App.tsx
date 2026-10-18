import { useState } from 'react';
import Hero from './components/Hero';
import FluidReactorScene from './components/three/FluidReactorScene';
import MetricsRibbon from './components/dashboard/MetricsRibbon';
import VaultsSection from './components/dashboard/VaultsSection';
import StakingTerminal from './components/dashboard/StakingTerminal';
import DeveloperSection from './components/dashboard/DeveloperSection';
import GovernanceSection from './components/dashboard/GovernanceSection';
import Footer from './components/dashboard/Footer';
import BookDemoModal from './components/modals/BookDemoModal';
import WalletModal from './components/modals/WalletModal';

export default function App() {
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>('0x71C...91FA');

  const scrollToStaking = () => {
    const el = document.querySelector('#ecosystem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f0f0] text-slate-800 selection:bg-[rgba(30,50,90,0.15)] selection:text-[rgba(30,50,90,1)]">
      {/* 1. Hero Section (Strictly Preserving Original Design + Enhanced Interactivity) */}
      <Hero
        onBookDemo={() => setIsBookDemoOpen(true)}
        walletAddress={walletAddress}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      {/* 2. Live Protocol Metrics & Event Stream */}
      <div id="metrics">
        <MetricsRibbon />
      </div>

      {/* 3. Three.js Interactive 3D Liquid Stream Reactor */}
      <FluidReactorScene />

      {/* 4. Smart Vaults Bento & Interactive APY Simulator (with Generated 3D Artwork) */}
      <VaultsSection onOpenStaking={scrollToStaking} />

      {/* 5. Interactive Fluid Staking & Real-Time Position Stream Terminal */}
      <StakingTerminal />

      {/* 6. Developer SDK Terminal & Architecture Highlights */}
      <DeveloperSection />

      {/* 7. Decentralized Governance & DAO Proposals */}
      <GovernanceSection />

      {/* 8. Comprehensive Footer */}
      <Footer />

      {/* Modals */}
      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        walletAddress={walletAddress}
        onConnect={(addr) => setWalletAddress(addr)}
        onDisconnect={() => setWalletAddress(null)}
      />
    </main>
  );
}

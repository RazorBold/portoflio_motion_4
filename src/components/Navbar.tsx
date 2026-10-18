import { motion } from 'motion/react';
import { ChevronRight, ArrowUpRight, Wallet } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ecosystem', href: '#ecosystem', hasDropdown: false },
  { label: 'Economics', href: '#economics', hasDropdown: true },
  { label: 'Developers', href: '#developers', hasDropdown: false },
  { label: 'Governance', href: '#governance', hasDropdown: true },
];

interface NavbarProps {
  onBookDemo?: () => void;
  walletAddress?: string | null;
  onOpenWallet?: () => void;
}

export default function Navbar({ onBookDemo, walletAddress, onOpenWallet }: NavbarProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
      {/* Left Side (hidden spacer for centering on desktop) */}
      <div className="flex-1 hidden md:flex items-center">
        {walletAddress && (
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-slate-200/80 text-xs font-mono text-slate-800 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{walletAddress}</span>
          </button>
        )}
      </div>

      {/* Center Menu */}
      <ul className="hidden md:flex items-center gap-8 text-[rgb(45,45,45)] font-normal text-sm">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group"
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile Logo */}
      <div className="md:hidden">
        <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.9)]">
          RIVR
        </span>
      </div>

      {/* Right Buttons */}
      <div className="flex-1 flex justify-end items-center gap-2">
        <button
          onClick={onOpenWallet}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 md:py-2 rounded-full bg-white/60 hover:bg-white/80 border border-slate-200 text-slate-700 text-xs md:text-sm font-normal transition-colors cursor-pointer"
        >
          <Wallet className="w-3.5 h-3.5 text-slate-600" />
          <span>{walletAddress ? 'Wallet' : 'Connect'}</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBookDemo}
          className="flex items-center bg-[rgba(30,50,90,0.8)] text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[rgba(30,50,90,1)] transition-colors group cursor-pointer"
        >
          <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-xs md:text-sm font-normal">Book Demo</span>
        </motion.button>
      </div>
    </nav>
  );
}

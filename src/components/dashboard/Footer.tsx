import { useState } from 'react';
import { ArrowUpRight, Check, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full max-w-[1536px] mx-auto px-4 md:px-8 pt-16 pb-12 border-t border-slate-200/80">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Column (Span 2) */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-regular tracking-tighter text-2xl text-[rgba(30,50,90,0.95)]">
                RIVR
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider bg-[rgba(30,50,90,0.08)] text-[rgba(30,50,90,0.9)] px-2 py-0.5 rounded-full font-semibold">
                Mainnet Beta
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm font-normal leading-relaxed mb-6">
              The premier fluid liquidity protocol transforming illiquid staking positions, locked NFTs,
              and yields into real-time payment streams.
            </p>
          </div>

          {/* Network Health Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 w-fit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-700 font-medium">
              All Systems Operational • Block #19,482,109
            </span>
          </div>
        </div>

        {/* Links: Protocol */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
            Protocol
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <a href="#economics" className="hover:text-slate-900 transition-colors">
                Smart Vaults
              </a>
            </li>
            <li>
              <a href="#ecosystem" className="hover:text-slate-900 transition-colors">
                Fluid Staking
              </a>
            </li>
            <li>
              <a href="#reactor" className="hover:text-slate-900 transition-colors">
                3D Reactor Engine
              </a>
            </li>
            <li>
              <a href="#governance" className="hover:text-slate-900 transition-colors">
                DAO Governance
              </a>
            </li>
          </ul>
        </div>

        {/* Links: Developers */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
            Developers
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <a href="#developers" className="hover:text-slate-900 transition-colors">
                TypeScript SDK
              </a>
            </li>
            <li>
              <a href="#developers" className="hover:text-slate-900 transition-colors">
                Solidity Interfaces
              </a>
            </li>
            <li>
              <a href="#developers" className="hover:text-slate-900 transition-colors">
                Security Audits
              </a>
            </li>
            <li>
              <a href="#developers" className="hover:text-slate-900 transition-colors">
                Bug Bounty ($500K)
              </a>
            </li>
          </ul>
        </div>

        {/* Links: Community & Newsletter */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
            Stay Updated
          </h4>
          <p className="text-xs text-slate-500 mb-3 font-normal">
            Weekly briefing on new stream vaults and liquidity multiplier pools.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[rgba(30,50,90,0.8)]"
            />
            <button
              type="submit"
              className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-[rgba(30,50,90,0.9)] hover:bg-[rgba(30,50,90,1)] text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>© 2026 RIVR Protocol Foundation. Open-source under Apache-2.0.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-800 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-800 transition-colors">
            Terms of Service
          </a>
          <span className="flex items-center gap-1 text-slate-400">
            Crafted for DeFi Innovators
          </span>
        </div>
      </div>
    </footer>
  );
}

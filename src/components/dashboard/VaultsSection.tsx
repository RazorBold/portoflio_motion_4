import { useState } from 'react';
import { motion } from 'motion/react';
import { ASSETS } from '../../assets/assets';
import { Calculator, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Cpu } from 'lucide-react';

export default function VaultsSection({ onOpenStaking }: { onOpenStaking: () => void }) {
  const [depositAmount, setDepositAmount] = useState(10000);
  const [selectedAsset, setSelectedAsset] = useState<'ETH' | 'USDC' | 'RIVR'>('RIVR');
  const [streamMonths, setStreamMonths] = useState(6);

  const rates = {
    RIVR: 0.245,
    ETH: 0.088,
    USDC: 0.142,
  };

  const projectedReturn = (depositAmount * rates[selectedAsset] * (streamMonths / 12)).toFixed(2);
  const projectedTotal = (depositAmount + parseFloat(projectedReturn)).toFixed(2);

  return (
    <section id="economics" className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-20">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
          <span className="text-xs font-medium text-[rgba(30,50,90,0.85)] tracking-wide uppercase">
            Protocol Architecture
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
          Smart Vaults & Liquid Streams
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          Transform locked positions and illiquid yield into real-time payment streams with mathematically
          guaranteed solvency and non-custodial smart contracts.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Smart Vaults & Yield Simulator (Span 7) */}
        <div className="lg:col-span-7 bg-white/80 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(30,50,90,0.8)] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-200/50">
                Automated Compounding
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Up to 24.5% APY</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight mb-2">
              Autonomous Liquidity Vaults
            </h3>
            <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6">
              Assets deposited into RIVR vaults automatically stream yields directly to your wallet every
              second without triggering expensive manual claiming gas fees.
            </p>

            {/* Interactive APY Calculator */}
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Calculator className="w-3.5 h-3.5 text-slate-500" />
                  <span>Yield Stream Simulator</span>
                </div>
                <div className="flex items-center gap-1">
                  {(['RIVR', 'ETH', 'USDC'] as const).map((asset) => (
                    <button
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        selectedAsset === asset
                          ? 'bg-[rgba(30,50,90,0.9)] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Amount Slider */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span>Deposit Amount</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {depositAmount.toLocaleString()} {selectedAsset}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full accent-[rgba(30,50,90,0.9)] cursor-pointer"
                />
              </div>

              {/* Duration Slider */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span>Streaming Duration</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {streamMonths} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={streamMonths}
                  onChange={(e) => setStreamMonths(Number(e.target.value))}
                  className="w-full accent-[rgba(30,50,90,0.9)] cursor-pointer"
                />
              </div>

              {/* Projected Returns Box */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80">
                <div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Projected Yield Stream
                  </div>
                  <div className="text-base sm:text-lg font-mono font-semibold text-emerald-600">
                    +{projectedReturn} {selectedAsset}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Total Estimated Return
                  </div>
                  <div className="text-base sm:text-lg font-mono font-semibold text-slate-900">
                    {projectedTotal} {selectedAsset}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="relative z-10 flex items-center justify-between pt-2">
            <button
              onClick={onOpenStaking}
              className="flex items-center gap-2 bg-[rgba(30,50,90,0.9)] hover:bg-[rgba(30,50,90,1)] text-white text-xs sm:text-sm font-normal px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs group/btn"
            >
              <span>Launch Staking Terminal</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-normal">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Audited by Trail of Bits
            </span>
          </div>

          {/* Background Illustration Thumbnail */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200/60 max-h-48 relative">
            <img
              src={ASSETS.vaultOrb}
              alt="RIVR Vault Orb 3D Render"
              className="w-full h-48 object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-mono font-medium drop-shadow-md">
                Refractive PBR Vault Sphere // Zero Slippage Engine
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 & 3: Right Column (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 2: NFT Liquidity Bonds */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(30,50,90,0.8)] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-200/50">
                  NFT & LP Liquidator
                </span>
                <span className="text-xs font-mono text-slate-500">ERC-721 / ERC-1155</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight mb-2">
                Convert Locked NFTs into Liquid Bonds
              </h3>
              <p className="text-sm text-slate-600 font-normal leading-relaxed mb-4">
                Unlock immediate cashflow against your Uniswap V3 LP positions, real-world assets, and
                governance locks without parting with ownership.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200/60 relative mt-2">
              <img
                src={ASSETS.crystalCard}
                alt="RIVR DeFi Liquidity Bond Crystal Card"
                className="w-full h-44 object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-white text-xs font-mono drop-shadow-md">
                  Prismatic Bond Tokenization // Instant Borrow
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Continuous Stream Highway */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(30,50,90,0.8)] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-200/50">
                  Sub-second Rails
                </span>
                <span className="text-xs font-mono text-slate-500">0.0001s Latency</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight mb-2">
                Continuous Stream Highway
              </h3>
              <p className="text-sm text-slate-600 font-normal leading-relaxed mb-4">
                Payments, salaries, and liquidity rebalancing happen uninterruptedly in fractional gas-free
                state updates.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200/60 relative mt-2">
              <img
                src={ASSETS.networkGrid}
                alt="RIVR Network Flow Stream"
                className="w-full h-44 object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-white text-xs font-mono drop-shadow-md">
                  Micro-Tick Stream Rails // Zero Congestion
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

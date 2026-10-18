import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Coins,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  Zap,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface StakingPool {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  tvl: string;
  userBalance: number;
  iconBg: string;
}

const POOLS: StakingPool[] = [
  {
    id: 'rivr',
    name: 'RIVR Genesis Staking',
    symbol: 'RIVR',
    apy: 24.5,
    tvl: '$184.2M',
    userBalance: 4250.0,
    iconBg: 'bg-blue-600',
  },
  {
    id: 'steth',
    name: 'Liquid Lido Ether',
    symbol: 'stETH',
    apy: 8.8,
    tvl: '$126.8M',
    userBalance: 5.4,
    iconBg: 'bg-cyan-600',
  },
  {
    id: 'usdc',
    name: 'USD Circle Stream',
    symbol: 'USDC',
    apy: 14.2,
    tvl: '$78.4M',
    userBalance: 12500.0,
    iconBg: 'bg-emerald-600',
  },
  {
    id: 'rivr-eth-lp',
    name: 'RIVR/ETH Dual Stream LP',
    symbol: 'RIVR-LP',
    apy: 38.4,
    tvl: '$29.4M',
    userBalance: 14.2,
    iconBg: 'bg-indigo-600',
  },
];

interface ActiveStream {
  id: string;
  poolSymbol: string;
  amount: number;
  startTime: number;
  accumulatedYield: number;
}

export default function StakingTerminal() {
  const [selectedPool, setSelectedPool] = useState<StakingPool>(POOLS[0]);
  const [amount, setAmount] = useState<string>('500');
  const [autoCompound, setAutoCompound] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStreams, setActiveStreams] = useState<ActiveStream[]>([
    {
      id: 'st-01',
      poolSymbol: 'RIVR',
      amount: 1500,
      startTime: Date.now() - 3600000 * 24 * 3,
      accumulatedYield: 30.62,
    },
    {
      id: 'st-02',
      poolSymbol: 'stETH',
      amount: 2.5,
      startTime: Date.now() - 3600000 * 24 * 1.5,
      accumulatedYield: 0.009,
    },
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const projectedDailyYield = (numAmount * (selectedPool.apy / 100)) / 365;

  const handleQuickPercent = (percent: number) => {
    const val = (selectedPool.userBalance * percent).toFixed(2);
    setAmount(val);
  };

  const handleStake = () => {
    if (numAmount <= 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#0284c7', '#38bdf8', '#1e325a', '#f59e0b'],
        });
      } catch (err) {
        // ignore
      }

      // Add to active streams
      const newStream: ActiveStream = {
        id: `st-${Date.now().toString().slice(-4)}`,
        poolSymbol: selectedPool.symbol,
        amount: numAmount,
        startTime: Date.now(),
        accumulatedYield: 0.0,
      };
      setActiveStreams([newStream, ...activeStreams]);
      setNotification(`Successfully staked ${numAmount} ${selectedPool.symbol}! Fluid streaming initialized.`);
      setAmount('');

      setTimeout(() => setNotification(null), 5000);
    }, 1000);
  };

  const handleClaimYield = (id: string) => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
    setActiveStreams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, accumulatedYield: 0 } : s))
    );
    setNotification('Claimed streamed yield to simulated wallet!');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <section id="ecosystem" className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 mb-3 shadow-xs">
          <Coins className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
          <span className="text-xs font-medium text-[rgba(30,50,90,0.85)] tracking-wide uppercase">
            Fluid Yield Terminal
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
          Stake Assets & Stream Liquid Yield
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
          Zero lockups, zero penalties. Lock your tokens into RIVR protocols and watch liquid yield stream
          directly into your balance by the millisecond.
        </p>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Terminal Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Staking Machine (Span 7) */}
        <div className="lg:col-span-7 bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Pool Selector Grid */}
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 block">
              1. Select Fluid Vault Pool
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {POOLS.map((pool) => (
                <button
                  key={pool.id}
                  onClick={() => setSelectedPool(pool)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPool.id === pool.id
                      ? 'border-[rgba(30,50,90,0.8)] bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{pool.symbol}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {pool.apy}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{pool.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-semibold uppercase tracking-wider text-slate-500">
                2. Deposit Amount
              </span>
              <span className="font-mono">
                Available: {selectedPool.userBalance.toLocaleString()} {selectedPool.symbol}
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-24 text-xl sm:text-2xl font-mono text-slate-900 focus:outline-none focus:border-[rgba(30,50,90,0.8)] focus:ring-1 focus:ring-[rgba(30,50,90,0.8)]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                  {selectedPool.symbol}
                </span>
              </div>
            </div>

            {/* Quick Balance Buttons */}
            <div className="flex items-center gap-2 mt-2.5">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleQuickPercent(pct)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Staking Specs & Live Rates */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 sm:p-5 mb-6 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Effective Dynamic APY</span>
              <span className="font-mono font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {selectedPool.apy}% APY
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Projected Daily Yield</span>
              <span className="font-mono font-semibold text-slate-800">
                +{projectedDailyYield.toFixed(4)} {selectedPool.symbol} / day
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Continuous Stream Frequency</span>
              <span className="font-mono text-slate-700">12 micro-ticks / sec</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated L2 Gas Fee</span>
              <span className="font-mono text-slate-700">~$0.04 (Subsidized)</span>
            </div>

            {/* Auto-Compound Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[rgba(30,50,90,0.8)]" />
                <span className="font-medium text-slate-700">Auto-Compound Stream</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoCompound(!autoCompound)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  autoCompound ? 'bg-[rgba(30,50,90,0.85)]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoCompound ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStake}
            disabled={isSubmitting || numAmount <= 0}
            className="w-full flex items-center justify-center gap-2 bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] disabled:opacity-50 text-white font-normal py-3.5 px-6 rounded-2xl transition-all cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Broadcasting to RIVR L2...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Stake & Open Liquid Stream</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Active Live Streams Positions (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-semibold text-slate-900">Your Active Streams</h3>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                {activeStreams.length} Position{activeStreams.length > 1 ? 's' : ''}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 font-normal leading-relaxed">
              Real-time earnings flow into your stream balance automatically with each block.
            </p>

            <div className="space-y-3">
              {activeStreams.map((st) => (
                <div
                  key={st.id}
                  className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[rgba(30,50,90,0.1)] flex items-center justify-center text-xs font-bold text-[rgba(30,50,90,0.9)]">
                        {st.poolSymbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {st.amount.toLocaleString()} {st.poolSymbol}
                        </div>
                        <div className="text-[10px] text-slate-500">Stream ID: #{st.id}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-emerald-600">
                        +{st.accumulatedYield.toFixed(3)} {st.poolSymbol}
                      </div>
                      <div className="text-[10px] text-slate-400">Streamed Yield</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Instant Unstake Available
                    </span>
                    <button
                      onClick={() => handleClaimYield(st.id)}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security guarantee */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-200/50 flex items-start gap-3">
            <Percent className="w-4 h-4 text-[rgba(30,50,90,0.8)] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed font-normal">
              <strong className="font-semibold text-slate-900">Solvency Guarantee: </strong>
              All yields are funded from continuous collateralized borrow interest rates and protocol MEV redistributions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

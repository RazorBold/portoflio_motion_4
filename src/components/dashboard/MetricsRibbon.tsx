import { useState, useEffect } from 'react';
import { ArrowUpRight, Activity, Zap, ShieldCheck, Waves } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
}

export default function MetricsRibbon() {
  const [streamedAmount, setStreamedAmount] = useState(418920412.5);

  // Live streaming ticker increment
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamedAmount((prev) => prev + Math.random() * 4.2 + 1.8);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const metrics: MetricItem[] = [
    {
      label: 'Total Value Streaming',
      value: `$${streamedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: '+24.8% vs last epoch',
      icon: Waves,
    },
    {
      label: 'Continuous Stream Rate',
      value: '$342.85 / sec',
      subValue: 'Sub-second micro-ticks',
      icon: Zap,
    },
    {
      label: 'Smart Vaults Active',
      value: '142 Vaults',
      subValue: 'Formal bytecode verified',
      icon: ShieldCheck,
    },
    {
      label: 'Network Gas Savings',
      value: '99.4%',
      subValue: 'Zero-gas streaming states',
      icon: Activity,
    },
  ];

  return (
    <section className="w-full max-w-[1536px] mx-auto px-4 md:px-8 -mt-6 sm:-mt-8 z-20 relative">
      {/* Live Stream Bar */}
      <div className="w-full rounded-2xl md:rounded-3xl bg-white/80 border border-slate-200/80 p-4 sm:p-6 shadow-sm backdrop-blur-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Live Liquidity River Stream
            </span>
            <span className="text-sm sm:text-base font-medium text-slate-800">
              Epoch #8,941 • Continuous block-by-block distribution
            </span>
          </div>
        </div>

        {/* Live event stream scroll */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <span className="font-mono text-emerald-700 font-semibold">0x7f4...91a</span>
          <span>streamed</span>
          <span className="font-semibold text-slate-800">12.5 RIVR</span>
          <span>to Lido Vault</span>
          <span className="text-slate-400">• 2s ago</span>
        </div>
      </div>

      {/* Grid of 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white/80 border border-slate-200/70 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {m.label}
                </span>
                <div className="p-2 rounded-xl bg-[rgba(30,50,90,0.06)] group-hover:bg-[rgba(30,50,90,0.12)] transition-colors">
                  <Icon className="w-4 h-4 text-[rgba(30,50,90,0.85)]" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-mono">
                  {m.value}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-normal">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  <span>{m.subValue}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

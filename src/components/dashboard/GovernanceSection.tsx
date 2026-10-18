import { useState } from 'react';
import { Vote, CheckCircle2, ChevronRight, PieChart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Proposal {
  id: string;
  title: string;
  proposer: string;
  status: 'Active' | 'Passed';
  votesFor: number;
  votesAgainst: number;
  userVoted?: 'for' | 'against';
}

export default function GovernanceSection() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'PIP-44',
      title: 'Deploy RIVR Continuous Streams to Monad Testnet & Base L2',
      proposer: '0x8bF...731C',
      status: 'Active',
      votesFor: 842100,
      votesAgainst: 42100,
    },
    {
      id: 'PIP-43',
      title: 'Allocate 2.5M RIVR for Automated LP Caustic Vault Liquidity Mining',
      proposer: '0x3cA...09EE',
      status: 'Active',
      votesFor: 1205000,
      votesAgainst: 184000,
    },
    {
      id: 'PIP-42',
      title: 'Integrate Chainlink Data Feeds for Sub-second Liquidation Curves',
      proposer: '0x12D...45Fa',
      status: 'Passed',
      votesFor: 2940000,
      votesAgainst: 12000,
    },
  ]);

  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);

  const handleVote = (id: string, side: 'for' | 'against') => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.userVoted) return p; // already voted
        return {
          ...p,
          userVoted: side,
          votesFor: side === 'for' ? p.votesFor + 5000 : p.votesFor,
          votesAgainst: side === 'against' ? p.votesAgainst + 5000 : p.votesAgainst,
        };
      })
    );

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }

    setVoteFeedback(`Vote registered: +5,000 RIVR voting power cast ${side.toUpperCase()} proposal ${id}.`);
    setTimeout(() => setVoteFeedback(null), 4000);
  };

  return (
    <section id="governance" className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-20">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 mb-3 shadow-xs">
          <Vote className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
          <span className="text-xs font-medium text-[rgba(30,50,90,0.85)] tracking-wide uppercase">
            Decentralized Governance
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
          Community-Owned Liquidity
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
          Staked RIVR holders vote directly on emission curves, newly whitelisted collateral assets, and
          protocol fee distribution.
        </p>
      </div>

      {voteFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>{voteFeedback}</span>
          </div>
          <button
            onClick={() => setVoteFeedback(null)}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Tokenomics & Active Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tokenomics Breakdown (Span 5) */}
        <div className="lg:col-span-5 bg-white/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-[rgba(30,50,90,0.9)]" />
              <h3 className="text-lg font-semibold text-slate-900">RIVR Token Allocation</h3>
            </div>
            <p className="text-xs text-slate-600 mb-6 font-normal leading-relaxed">
              Max Supply: 1,000,000,000 RIVR. Zero VC unlock dumps with continuous 3-year vesting streams.
            </p>

            {/* Distribution Bars */}
            <div className="space-y-3.5">
              {[
                { label: 'Staking & Streaming Rewards', pct: 40, color: 'bg-[rgba(30,50,90,0.9)]' },
                { label: 'DAO Treasury & Liquidity', pct: 25, color: 'bg-blue-600' },
                { label: 'Ecosystem & Grants', pct: 20, color: 'bg-cyan-600' },
                { label: 'Core Contributors & Research', pct: 15, color: 'bg-slate-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-mono font-semibold">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200/80 text-xs text-slate-500 font-mono flex items-center justify-between">
            <span>Contract: 0x981...190F</span>
            <span className="text-emerald-700 font-semibold">Verified on Etherscan</span>
          </div>
        </div>

        {/* Proposals List (Span 7) */}
        <div className="lg:col-span-7 bg-white/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Governance Proposals</h3>
            <span className="text-xs text-slate-500 font-mono">Quorum: 4.0%</span>
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => {
              const totalVotes = prop.votesFor + prop.votesAgainst;
              const forPct = totalVotes > 0 ? Math.round((prop.votesFor / totalVotes) * 100) : 50;

              return (
                <div
                  key={prop.id}
                  className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 sm:p-5 transition-all hover:border-slate-300"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {prop.id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          prop.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{prop.proposer}</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-normal text-slate-900 mb-3 leading-snug">
                    {prop.title}
                  </h4>

                  {/* Voting Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
                      <span className="text-emerald-700 font-semibold">For: {forPct}%</span>
                      <span className="text-slate-500">Against: {100 - forPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${forPct}%` }} />
                      <div className="h-full bg-rose-400" style={{ width: `${100 - forPct}%` }} />
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {prop.userVoted ? (
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        You voted {prop.userVoted.toUpperCase()}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(prop.id, 'for')}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Vote For
                        </button>
                        <button
                          onClick={() => handleVote(prop.id, 'against')}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Vote Against
                        </button>
                      </div>
                    )}
                    <span className="text-xs text-slate-500 font-mono">
                      {totalVotes.toLocaleString()} RIVR Cast
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

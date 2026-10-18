import { useState } from 'react';
import { Terminal, Copy, Check, Code2, Layers, Cpu, ExternalLink } from 'lucide-react';

const CODE_EXAMPLES: Record<string, { code: string; language: string }> = {
  typescript: {
    language: 'TypeScript',
    code: `import { RivrClient, StreamVault } from '@rivr/sdk';

// Initialize zero-latency stream client
const rivr = new RivrClient({
  network: 'mainnet',
  rpcUrl: 'https://rpc.rivr.stream',
});

// Create continuous liquidity stream from an NFT LP
const stream = await rivr.streams.open({
  recipient: '0x32A...89Fd',
  ratePerSecond: 0.00045, // in stETH
  collateral: {
    type: 'ERC721',
    address: '0xC36...780B', // Uniswap V3 LP #19024
  },
  autoCompound: true,
});

console.log(\`Active Fluid Stream ID: \${stream.id}\`);
await stream.onTick((tick) => console.log('Yield tick:', tick.amount));`,
  },
  solidity: {
    language: 'Solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@rivr/contracts/interfaces/IRivrStreamEngine.sol";

contract FluidYieldDistributor {
    IRivrStreamEngine public immutable streamEngine;

    constructor(address _streamEngine) {
        streamEngine = IRivrStreamEngine(_streamEngine);
    }

    function depositAndStream(address recipient, uint256 flowRate) external payable {
        // Continuous block-by-block stream with 0-gas updates
        streamEngine.createFlow{value: msg.value}(
            msg.sender,
            recipient,
            flowRate
        );
    }
}`,
  },
  rust: {
    language: 'Rust',
    code: `use rivr_core::{StreamEngine, FlowRate, Asset};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = StreamEngine::connect("https://rpc.rivr.stream").await?;

    let stream = client
        .open_continuous_channel(
            "0x91F...22A",
            Asset::RIVR,
            FlowRate::from_rate_per_sec(0.002)
        )
        .await?;

    println!("Channel online: {:?}", stream.channel_id());
    Ok(())
}`,
  },
};

export default function DeveloperSection() {
  const [activeTab, setActiveTab] = useState<'typescript' | 'solidity' | 'rust'>('typescript');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-20">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 mb-3 shadow-xs">
          <Code2 className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
          <span className="text-xs font-medium text-[rgba(30,50,90,0.85)] tracking-wide uppercase">
            Developer Ecosystem
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
          Built for Composable DeFi Protocols
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
          Embed continuous money streaming into your dApp, DAO payroll, or lending protocol with 4 lines
          of code.
        </p>
      </div>

      {/* Grid: Code Terminal & Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Code Terminal (Span 7) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between border border-slate-800 text-slate-200">
          <div>
            {/* Window Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/90 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">rivr-stream-client</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
                {(['typescript', 'solidity', 'rust'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-slate-800 text-white font-medium shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Content */}
            <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto p-2 scrollbar-thin">
              <code>{CODE_EXAMPLES[activeTab].code}</code>
            </pre>
          </div>

          {/* Terminal Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="font-mono">npm i @rivr/sdk</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer border border-slate-800"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Architecture Highlights (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(30,50,90,0.06)] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-[rgba(30,50,90,0.9)]" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">
              Micro-Tick Settlement Virtual Machine
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Eliminate discrete transaction batching. Balances update continuously as differential
              calculus functions over elapsed block time.
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(30,50,90,0.06)] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5 text-[rgba(30,50,90,0.9)]" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">
              Cross-Chain Liquidity Bridges
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Stream assets across Ethereum Mainnet, Arbitrum, Optimism, and Base without locked cross-chain
              bridge custody risks.
            </p>
          </div>

          <div className="bg-[rgba(30,50,90,0.04)] border border-[rgba(30,50,90,0.12)] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[rgba(30,50,90,0.8)]">
                Documentation & API Specs
              </div>
              <div className="text-sm font-medium text-slate-800 mt-0.5">
                Explore guides, tutorials & SDK references
              </div>
            </div>
            <a
              href="#docs"
              onClick={(e) => {
                e.preventDefault();
                alert('Documentation portal: Comprehensive SDK v2.4 Reference ready.');
              }}
              className="p-3 rounded-full bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-700" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

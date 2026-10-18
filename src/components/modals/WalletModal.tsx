import { useState } from 'react';
import { X, Wallet, CheckCircle2, Copy, Check, ExternalLink, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

const WALLET_OPTIONS = [
  {
    name: 'MetaMask',
    iconText: '🦊',
    desc: 'Connect with desktop extension or mobile app',
  },
  {
    name: 'Coinbase Wallet',
    iconText: '🔵',
    desc: 'Instant connection with passkeys or mobile',
  },
  {
    name: 'Phantom',
    iconText: '👻',
    desc: 'Multi-chain Solana & EVM streaming',
  },
  {
    name: 'WalletConnect',
    iconText: '⚡',
    desc: 'QR code scan for 300+ mobile wallets',
  },
];

export default function WalletModal({
  isOpen,
  onClose,
  walletAddress,
  onConnect,
  onDisconnect,
}: WalletModalProps) {
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleSelectWallet = (name: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      const mockAddr = '0x71C...' + Math.random().toString(36).substring(2, 6).toUpperCase();
      onConnect(mockAddr);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
      onClose();
    }, 800);
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {walletAddress ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Wallet Connected</h3>
                <span className="text-xs text-slate-500 font-mono">RIVR Liquid L2 Network</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Account Address</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[rgba(30,50,90,0.9)] hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-sm font-mono font-semibold text-slate-800">{walletAddress}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] text-slate-500">RIVR Balance</div>
                <div className="text-base font-mono font-semibold text-slate-900">4,250.00</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Live Yield Stream</div>
                <div className="text-base font-mono font-semibold text-emerald-600">+$18.40/day</div>
              </div>
            </div>

            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[rgba(30,50,90,0.1)] text-[rgba(30,50,90,0.9)]">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(30,50,90,0.9)]">
                Web3 Connection
              </span>
            </div>

            <h3 className="text-2xl font-normal text-slate-900 tracking-tight mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-xs text-slate-600 mb-6 font-normal leading-relaxed">
              Select your preferred crypto wallet to begin streaming yields and managing smart vaults.
            </p>

            <div className="space-y-2.5">
              {WALLET_OPTIONS.map((wallet) => (
                <button
                  key={wallet.name}
                  disabled={isConnecting}
                  onClick={() => handleSelectWallet(wallet.name)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[rgba(30,50,90,0.8)] hover:bg-slate-50 transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.iconText}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-[rgba(30,50,90,0.95)]">
                        {wallet.name}
                      </div>
                      <div className="text-xs text-slate-500 font-normal">{wallet.desc}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[rgba(30,50,90,0.9)] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

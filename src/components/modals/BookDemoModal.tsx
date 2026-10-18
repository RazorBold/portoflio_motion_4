import { useState } from 'react';
import { X, Calendar, CheckCircle2, Clock, Building2, User, Mail, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [useCase, setUseCase] = useState('Protocol Liquidity Streaming');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Demo Session Reserved!</h3>
            <p className="text-sm text-slate-600 max-w-sm">
              We&apos;ve sent a calendar invitation and private sandbox credentials to{' '}
              <span className="font-semibold text-slate-800">{email || 'your email'}</span>.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[rgba(30,50,90,0.1)] text-[rgba(30,50,90,0.9)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(30,50,90,0.9)]">
                Institutional & Protocol Onboarding
              </span>
            </div>

            <h3 className="text-2xl font-normal text-slate-900 tracking-tight mb-2">
              Book a RIVR Fluid Demo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Schedule a 25-minute live technical walkthrough with our protocol engineers to explore smart
              vault integration and liquidity stream contracts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Satoshi Nakamoto"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[rgba(30,50,90,0.8)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="team@protocol.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[rgba(30,50,90,0.8)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Protocol / Organization</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="DeFi DAO / Venture / Fund"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[rgba(30,50,90,0.8)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Interest</label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[rgba(30,50,90,0.8)] bg-white"
                >
                  <option>Protocol Liquidity Streaming</option>
                  <option>Uniswap V3 NFT Yield Tokenization</option>
                  <option>Autonomous DAO Payroll & Streams</option>
                  <option>Custom Smart Vault Architecture</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-2xl bg-[rgba(30,50,90,0.9)] hover:bg-[rgba(30,50,90,1)] text-white text-sm font-medium transition-colors cursor-pointer shadow-md"
                >
                  Confirm Demo Invitation
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

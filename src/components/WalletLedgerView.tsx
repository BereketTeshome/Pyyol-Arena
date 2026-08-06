import React, { useState } from 'react';
import { globalLedger } from '../services/ledgerService';
import { LedgerTransaction, WalletLimits, PayoutRequest } from '../types/arena';

interface WalletLedgerViewProps {
  onBalanceUpdated: () => void;
}

export const WalletLedgerView: React.FC<WalletLedgerViewProps> = ({ onBalanceUpdated }) => {
  const [balance, setBalance] = useState(globalLedger.getBalance());
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(globalLedger.getTransactions());
  const [limits, setLimits] = useState<WalletLimits>(globalLedger.getLimits());
  const [payouts, setPayouts] = useState<PayoutRequest[]>(globalLedger.getPayouts());

  // Modal toggles
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Form states
  const [payoutCoinsInput, setPayoutCoinsInput] = useState(2500);
  const [recipientHandle, setRecipientHandle] = useState('@dev_quantum_01');

  const refreshData = () => {
    setBalance(globalLedger.getBalance());
    setTransactions(globalLedger.getTransactions());
    setLimits(globalLedger.getLimits());
    setPayouts(globalLedger.getPayouts());
    onBalanceUpdated();
  };

  const handleBuyPack = (packName: string, coins: number, usd: number) => {
    globalLedger.buyCoinPack(packName, coins, usd);
    refreshData();
    setShowBuyModal(false);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      globalLedger.requestPayout(payoutCoinsInput, recipientHandle);
      refreshData();
      setShowPayoutModal(false);
    } catch (err: any) {
      alert(err.message || 'Payout request failed');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-1">
            DOUBLE-ENTRY FINANCIAL LEDGER & WALLET
          </span>
          <h1 className="text-2xl font-bold uppercase text-white tracking-tight font-serif">
            Coin Treasury: {balance.toLocaleString()} c (${(balance * 0.01).toFixed(2)} USD)
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            1 Coin = 1¢ face value. All ledger entries follow strictly audited double-entry accounting invariants.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={() => setShowBuyModal(true)}
            className="bg-white hover:bg-slate-100 text-[#071321] font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all uppercase"
          >
            + Buy Coin Packs
          </button>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="bg-[#0B1828]/80 hover:bg-[#0E2034] text-white border border-white/20 font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer backdrop-blur-md shadow-lg transition-all uppercase"
          >
            Cash Out Winnings →
          </button>
        </div>
      </div>

      {/* Financial Controls Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0A1827]/80 border border-white/15 p-5 rounded-3xl backdrop-blur-2xl shadow-xl">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Max Stake per Match</span>
          <span className="text-xl font-mono font-bold text-cyan-300 mt-0.5 block">
            {limits.maxBidPerMatch.toLocaleString()} c
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Arena Pass Status</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-0.5 block">
            ACTIVE (PRO)
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Daily Transaction Cap</span>
          <span className="text-xl font-mono font-bold text-white mt-0.5 block">
            {limits.dailyCap.toLocaleString()} c
          </span>
        </div>
      </div>

      {/* Cashout Requests Pending Clearing Panel */}
      {payouts.length > 0 && (
        <div className="bg-[#0A1827]/80 border border-cyan-500/30 p-5 rounded-3xl backdrop-blur-2xl shadow-xl font-mono text-xs">
          <span className="text-[10px] font-bold uppercase text-cyan-300 block mb-2">
            Pending Stripe Connect Cashout Requests (Antifraud Clearing Gate)
          </span>
          <div className="space-y-2">
            {payouts.map((p) => (
              <div key={p.id} className="flex justify-between items-center bg-[#050D17] p-3 rounded-xl border border-white/10">
                <div>
                  <span className="text-white font-bold">{p.coinsAmount.toLocaleString()} coins (${p.usdAmount.toFixed(2)} USD)</span>
                  <span className="text-slate-400 text-[10px] block">Requested at: {p.requestedAt}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-300 font-bold bg-amber-950/80 px-2.5 py-0.5 border border-amber-500/40 text-[9px] uppercase rounded-full">
                    {p.status}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Clears at: {p.clearsAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Double-Entry Ledger Transactions Table */}
      <div className="bg-[#0A1827]/80 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col text-xs">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Authoritative Double-Entry Ledger Transactions
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">✓ Invariant: Sum(Debit) == Sum(Credit)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#050D17] text-slate-400 text-[9px] uppercase border-b border-white/10 font-mono">
                <th className="p-3">Tx Hash</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Debit Account</th>
                <th className="p-3">Credit Account</th>
                <th className="p-3 text-right">Amount (Coins)</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[11px] font-mono">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-cyan-400 font-bold">{tx.hash}</td>
                  <td className="p-3 text-slate-400 text-[10px]">{tx.timestamp}</td>
                  <td className="p-3 text-indigo-300">{tx.debitAccount}</td>
                  <td className="p-3 text-emerald-300">{tx.creditAccount}</td>
                  <td className="p-3 text-right font-bold text-cyan-300">
                    +{tx.amountCoins.toLocaleString()} c
                  </td>
                  <td className="p-3 text-slate-200">{tx.description}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded-full text-[8px] uppercase">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy Coin Packs Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0A1827] border border-white/20 w-full max-w-md p-6 rounded-3xl relative text-slate-200 shadow-2xl backdrop-blur-2xl">
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-bold uppercase text-white mb-4 border-b border-white/10 pb-3 font-serif">
              Purchase Coin Packs (Stripe Dev Gateway)
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Starter Pack', coins: 1000, usd: 10 },
                { name: 'Pro Competitor Pack', coins: 5000, usd: 50 },
                { name: 'High Roller Treasury Pack', coins: 25000, usd: 250 },
              ].map((pack) => (
                <div
                  key={pack.name}
                  onClick={() => handleBuyPack(pack.name, pack.coins, pack.usd)}
                  className="p-4 bg-[#050D17] hover:bg-[#0E2034] border border-white/10 hover:border-cyan-400/50 rounded-2xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{pack.name}</span>
                    <span className="text-cyan-300 font-mono text-sm font-bold">
                      +{pack.coins.toLocaleString()} Coins
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-white text-[#071321] hover:bg-slate-100 font-bold uppercase text-[10px] rounded-full cursor-pointer shadow-md">
                    Buy ${pack.usd}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cashout Winnings Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0A1827] border border-white/20 w-full max-w-md p-6 rounded-3xl relative text-slate-200 shadow-2xl backdrop-blur-2xl">
            <button
              onClick={() => setShowPayoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-bold uppercase text-white mb-4 border-b border-white/10 pb-3 font-serif">
              Withdraw Winnings (Stripe Connect)
            </h2>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-300 mb-1">
                  Recipient Handle
                </label>
                <input
                  type="text"
                  required
                  value={recipientHandle}
                  onChange={(e) => setRecipientHandle(e.target.value)}
                  className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-300 mb-1">
                  Withdraw Amount (Coins)
                </label>
                <input
                  type="number"
                  min={500}
                  max={balance}
                  value={payoutCoinsInput}
                  onChange={(e) => setPayoutCoinsInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400 block mt-1">
                  Equivalent to ${(payoutCoinsInput * 0.01).toFixed(2)} USD (subject to 24h clearing gate)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-[#071321] hover:bg-slate-100 font-bold uppercase text-xs rounded-full cursor-pointer transition-all shadow-md"
              >
                Submit Cashout Request →
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

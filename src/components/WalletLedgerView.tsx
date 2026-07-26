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
  const [showLimitsModal, setShowLimitsModal] = useState(false);

  // Form states
  const [payoutCoinsInput, setPayoutCoinsInput] = useState(2500);
  const [recipientHandle, setRecipientHandle] = useState('@dev_quantum_01');
  const [newLossLimit, setNewLossLimit] = useState(limits.sessionLossLimit);
  const [newMaxBid, setNewMaxBid] = useState(limits.maxBidPerMatch);

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

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    globalLedger.updateLimits({
      sessionLossLimit: newLossLimit,
      maxBidPerMatch: newMaxBid,
    });
    refreshData();
    setShowLimitsModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#22222a] pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-1">
            DOUBLE-ENTRY FINANCIAL LEDGER & WALLET
          </span>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
            Coin Treasury: {balance.toLocaleString()} c (${(balance * 0.01).toFixed(2)} USD)
          </h1>
          <p className="text-xs text-[#777] font-mono mt-0.5">
            1 Coin = 1¢ face value. All ledger entries follow strictly audited double-entry accounting invariants.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowBuyModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-5 py-2 uppercase transform -skew-x-12 cursor-pointer transition-all shadow-[0_0_12px_rgba(245,158,11,0.4)]"
          >
            + Buy Coin Packs
          </button>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="border border-[#333] hover:border-cyan-500 hover:text-cyan-400 text-white font-black text-xs px-5 py-2 uppercase transform -skew-x-12 cursor-pointer bg-[#14141c] transition-all"
          >
            Cash Out Winnings →
          </button>
        </div>
      </div>

      {/* Financial Controls & Limits Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0F0F14] border border-[#22222a] p-4">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Session Loss Limit</span>
          <span className="text-xl font-mono font-bold text-white mt-0.5 block">
            {limits.currentSessionLoss.toLocaleString()} / {limits.sessionLossLimit.toLocaleString()} c
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Max Bid per Match</span>
          <span className="text-xl font-mono font-bold text-amber-400 mt-0.5 block">
            {limits.maxBidPerMatch.toLocaleString()} c
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Arena Pass Status</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-0.5 block">
            ACTIVE (PRO)
          </span>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setShowLimitsModal(true)}
            className="w-full py-2 bg-[#1A1A24] hover:bg-[#222230] text-cyan-400 border border-cyan-800 text-[10px] font-bold uppercase cursor-pointer"
          >
            Edit Spending Limits ⚙
          </button>
        </div>
      </div>

      {/* Cashout Requests Pending Clearing Panel */}
      {payouts.length > 0 && (
        <div className="bg-[#12121c] border border-cyan-800 p-4 font-mono text-xs">
          <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-2">
            Pending Stripe Connect Cashout Requests (Antifraud Clearing Gate)
          </span>
          <div className="space-y-2">
            {payouts.map((p) => (
              <div key={p.id} className="flex justify-between items-center bg-[#09090e] p-2.5 border border-[#222]">
                <div>
                  <span className="text-white font-bold">{p.coinsAmount.toLocaleString()} coins (${p.usdAmount.toFixed(2)} USD)</span>
                  <span className="text-[#666] text-[10px] block">Requested at: {p.requestedAt}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold bg-amber-950 px-2 py-0.5 border border-amber-800 text-[9px] uppercase">
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
      <div className="bg-[#0F0F14] border border-[#22222a] p-4 flex flex-col font-mono text-xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Authoritative Double-Entry Ledger Transactions
          </span>
          <span className="text-[10px] text-emerald-400">✓ Invariant: Sum(Debit) == Sum(Credit)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#14141c] text-[#777] text-[9px] uppercase border-b border-[#22222a]">
                <th className="p-2.5">Tx Hash</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Debit Account</th>
                <th className="p-2.5">Credit Account</th>
                <th className="p-2.5 text-right">Amount (Coins)</th>
                <th className="p-2.5">Description</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181822] text-[11px]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#14141e] transition-colors">
                  <td className="p-2.5 text-cyan-400 font-bold">{tx.hash}</td>
                  <td className="p-2.5 text-slate-400 text-[10px]">{tx.timestamp}</td>
                  <td className="p-2.5 text-indigo-300">{tx.debitAccount}</td>
                  <td className="p-2.5 text-emerald-300">{tx.creditAccount}</td>
                  <td className="p-2.5 text-right font-bold text-amber-400">
                    +{tx.amountCoins.toLocaleString()} c
                  </td>
                  <td className="p-2.5 text-slate-300">{tx.description}</td>
                  <td className="p-2.5 text-center">
                    <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[8px] uppercase">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-md p-6 relative text-slate-200">
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-bold uppercase text-amber-400 mb-4 border-b border-[#222] pb-2">
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
                  className="p-3 bg-[#14141d] hover:bg-[#1a1a28] border border-[#22222a] hover:border-amber-500/60 flex justify-between items-center cursor-pointer transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{pack.name}</span>
                    <span className="text-amber-400 font-mono text-sm font-bold">
                      +{pack.coins.toLocaleString()} Coins
                    </span>
                  </div>
                  <button className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] transform -skew-x-12 cursor-pointer">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-md p-6 relative text-slate-200">
            <button
              onClick={() => setShowPayoutModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-bold uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">
              Withdraw Winnings (Stripe Connect)
            </h2>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Recipient Handle
                </label>
                <input
                  type="text"
                  required
                  value={recipientHandle}
                  onChange={(e) => setRecipientHandle(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Withdraw Amount (Coins)
                </label>
                <input
                  type="number"
                  min={500}
                  max={balance}
                  value={payoutCoinsInput}
                  onChange={(e) => setPayoutCoinsInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-amber-400 font-mono font-bold"
                />
                <span className="text-[9px] text-slate-400 block mt-1">
                  Equivalent to ${(payoutCoinsInput * 0.01).toFixed(2)} USD (subject to 24h clearing gate)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs transform -skew-x-12 cursor-pointer"
              >
                Submit Cashout Request →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spending Limits Modal */}
      {showLimitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-md p-6 relative text-slate-200">
            <button
              onClick={() => setShowLimitsModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-bold uppercase text-slate-200 mb-4 border-b border-[#222] pb-2">
              Configure Financial Safety Limits
            </h2>
            <form onSubmit={handleSaveLimits} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Session Loss Limit (Coins)
                </label>
                <input
                  type="number"
                  value={newLossLimit}
                  onChange={(e) => setNewLossLimit(parseInt(e.target.value) || 1000)}
                  className="w-full bg-[#181822] border border-[#2a2a36] px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Max Bid per Match (Coins)
                </label>
                <input
                  type="number"
                  value={newMaxBid}
                  onChange={(e) => setNewMaxBid(parseInt(e.target.value) || 100)}
                  className="w-full bg-[#181822] border border-[#2a2a36] px-3 py-1.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs transform -skew-x-12 cursor-pointer"
              >
                Save Safety Controls
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

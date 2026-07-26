import { LedgerTransaction, WalletLimits, PayoutRequest } from '../types/arena';

export class LedgerEngine {
  private transactions: LedgerTransaction[];
  private walletCoins: number;
  private limits: WalletLimits;
  private payouts: PayoutRequest[];

  constructor(initialCoins = 12450) {
    this.walletCoins = initialCoins;
    this.transactions = [
      {
        id: 'tx_init_1',
        hash: '0x8f192b0c3a2f481e',
        timestamp: '2026-07-25 18:22:01',
        debitAccount: 'PLATFORM_TREASURY',
        creditAccount: 'USER_WALLET',
        amountCoins: 10000,
        description: 'Initial Registration Developer Grant',
        type: 'INITIAL_BONUS',
        status: 'SETTLED',
      },
      {
        id: 'tx_match_2',
        hash: '0x7e291a1b4c5d6e7f',
        timestamp: '2026-07-25 21:05:14',
        debitAccount: 'USER_WALLET',
        creditAccount: 'MATCH_ESCROW_STAKE',
        amountCoins: 1000,
        description: 'Match Stake vs PawnStorm (Chess)',
        type: 'MATCH_STAKE',
        status: 'SETTLED',
      },
      {
        id: 'tx_payout_3',
        hash: '0x3a4b5c6d7e8f9a0b',
        timestamp: '2026-07-25 21:12:30',
        debitAccount: 'MATCH_ESCROW_STAKE',
        creditAccount: 'USER_WALLET',
        amountCoins: 1900,
        description: 'Match Victory Payout (Ares_v4.2 won)',
        type: 'MATCH_PAYOUT',
        status: 'SETTLED',
      },
      {
        id: 'tx_sub_4',
        hash: '0x9d8c7b6a5f4e3d2c',
        timestamp: '2026-07-26 01:00:00',
        debitAccount: 'STRIPE_BILLING',
        creditAccount: 'USER_WALLET',
        amountCoins: 1550,
        description: 'Arena Pass Monthly Coin Allocation',
        type: 'SUBSCRIPTION',
        status: 'SETTLED',
      }
    ];

    this.limits = {
      sessionLossLimit: 5000,
      currentSessionLoss: 1200,
      maxBidPerMatch: 1200,
      minBalanceRequired: 500,
      dailyCap: 15000,
    };

    this.payouts = [];
  }

  public getBalance(): number {
    return this.walletCoins;
  }

  public getTransactions(): LedgerTransaction[] {
    return [...this.transactions];
  }

  public getLimits(): WalletLimits {
    return { ...this.limits };
  }

  public getPayouts(): PayoutRequest[] {
    return [...this.payouts];
  }

  public updateLimits(newLimits: Partial<WalletLimits>): WalletLimits {
    this.limits = { ...this.limits, ...newLimits };
    return this.limits;
  }

  public buyCoinPack(packName: string, coins: number, usdCost: number): LedgerTransaction {
    const hash = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const tx: LedgerTransaction = {
      id: 'tx_buy_' + Date.now(),
      hash,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      debitAccount: `STRIPE_CHECKOUT_USD ($${usdCost})`,
      creditAccount: 'USER_WALLET',
      amountCoins: coins,
      description: `Purchased Coin Pack: ${packName} (${coins} coins)`,
      type: 'COIN_PURCHASE',
      status: 'SETTLED',
    };

    this.transactions.unshift(tx);
    this.walletCoins += coins;
    return tx;
  }

  public requestPayout(coinsAmount: number, recipientHandle: string): PayoutRequest {
    if (coinsAmount > this.walletCoins) {
      throw new Error('Insufficient wallet balance for payout request');
    }

    const usdAmount = coinsAmount * 0.01; // 1 coin = 1 cent
    const now = new Date();
    const clearsDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hr clearing window

    const payout: PayoutRequest = {
      id: 'po_' + Date.now(),
      coinsAmount,
      usdAmount,
      status: 'PENDING_REVIEW',
      requestedAt: now.toISOString().replace('T', ' ').substring(0, 19),
      clearsAt: clearsDate.toISOString().replace('T', ' ').substring(0, 19),
      antifraudPassed: true,
      recipientHandle,
    };

    // Debit wallet to escrow
    const hash = '0x' + Math.random().toString(16).substring(2, 18);
    const tx: LedgerTransaction = {
      id: 'tx_po_' + Date.now(),
      hash,
      timestamp: payout.requestedAt,
      debitAccount: 'USER_WALLET',
      creditAccount: 'WITHDRAWAL_CLEARING_ESCROW',
      amountCoins: coinsAmount,
      description: `Cashout Request to Stripe Connect ($${usdAmount.toFixed(2)})`,
      type: 'CASHOUT',
      status: 'SETTLED',
    };

    this.walletCoins -= coinsAmount;
    this.transactions.unshift(tx);
    this.payouts.unshift(payout);
    return payout;
  }

  public recordMatchStake(agentName: string, coins: number): LedgerTransaction {
    if (coins > this.walletCoins) {
      throw new Error('Insufficient funds to stake match');
    }
    if (coins > this.limits.maxBidPerMatch) {
      throw new Error(`Stake exceeds Max Bid limit of ${this.limits.maxBidPerMatch} coins`);
    }

    const hash = '0x' + Math.random().toString(16).substring(2, 18);
    const tx: LedgerTransaction = {
      id: 'tx_stake_' + Date.now(),
      hash,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      debitAccount: 'USER_WALLET',
      creditAccount: 'MATCH_ESCROW_STAKE',
      amountCoins: coins,
      description: `Match Stake: ${agentName}`,
      type: 'MATCH_STAKE',
      status: 'SETTLED',
    };

    this.walletCoins -= coins;
    this.transactions.unshift(tx);
    return tx;
  }
}

export const globalLedger = new LedgerEngine(12450);

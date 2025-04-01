
export type CryptoType = 'ETH' | 'BTC';

export interface DCAPurchase {
  id: string;
  date: Date;
  amountUSD: number;
  price: number;
  amount: number;
  cryptoType: CryptoType;
}

export interface DCASummary {
  totalInvested: number;
  totalAmount: number;
  averageCostBasis: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface CryptoSummary {
  ETH: DCASummary;
  BTC: DCASummary;
  combined: DCASummary;
}

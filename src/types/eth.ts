
export interface DCAPurchase {
  id: string;
  date: Date;
  amountUSD: number;
  ethPrice: number;
  ethAmount: number;
}

export interface DCASummary {
  totalInvested: number;
  totalEth: number;
  averageCostBasis: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}


import { DCAPurchase, DCASummary } from '@/types/eth';

export const calculateEthAmount = (amountUSD: number, ethPrice: number): number => {
  return amountUSD / ethPrice;
};

export const calculateDCASummary = (purchases: DCAPurchase[], currentEthPrice: number): DCASummary => {
  if (purchases.length === 0) {
    return {
      totalInvested: 0,
      totalEth: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    };
  }

  const totalInvested = purchases.reduce((sum, purchase) => sum + purchase.amountUSD, 0);
  const totalEth = purchases.reduce((sum, purchase) => sum + purchase.ethAmount, 0);
  const averageCostBasis = totalInvested / totalEth;
  const currentValue = totalEth * currentEthPrice;
  const profitLoss = currentValue - totalInvested;
  const profitLossPercentage = (profitLoss / totalInvested) * 100;

  return {
    totalInvested,
    totalEth,
    averageCostBasis,
    currentValue,
    profitLoss,
    profitLossPercentage
  };
};

// Format USD values
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Format ETH values
export const formatETH = (value: number): string => {
  return `${value.toFixed(6)} ETH`;
};

// Format percentage values
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Generate sample data for demonstration
export const generateSampleData = (): DCAPurchase[] => {
  const today = new Date();
  const sampleData: DCAPurchase[] = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // Generate a pseudo-random ETH price between $1500 and $3500
    const ethPrice = 1500 + Math.random() * 2000;
    const amountUSD = 250; // Fixed DCA amount
    const ethAmount = calculateEthAmount(amountUSD, ethPrice);
    
    sampleData.unshift({
      id: `purchase-${i}`,
      date,
      amountUSD,
      ethPrice,
      ethAmount
    });
  }
  
  return sampleData;
};

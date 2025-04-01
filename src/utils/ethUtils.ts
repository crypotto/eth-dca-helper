
import { DCAPurchase, DCASummary, CryptoType, CryptoSummary } from '@/types/eth';

export const calculateCryptoAmount = (amountUSD: number, price: number): number => {
  return amountUSD / price;
};

export const calculateDCASummary = (purchases: DCAPurchase[], currentPrice: number): DCASummary => {
  if (purchases.length === 0) {
    return {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    };
  }

  const totalInvested = purchases.reduce((sum, purchase) => sum + purchase.amountUSD, 0);
  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const averageCostBasis = totalInvested / totalAmount;
  const currentValue = totalAmount * currentPrice;
  const profitLoss = currentValue - totalInvested;
  const profitLossPercentage = (profitLoss / totalInvested) * 100;

  return {
    totalInvested,
    totalAmount,
    averageCostBasis,
    currentValue,
    profitLoss,
    profitLossPercentage
  };
};

export const calculateCryptoSummaries = (
  purchases: DCAPurchase[], 
  currentEthPrice: number, 
  currentBtcPrice: number
): CryptoSummary => {
  const ethPurchases = purchases.filter(p => p.cryptoType === 'ETH');
  const btcPurchases = purchases.filter(p => p.cryptoType === 'BTC');
  
  const ethSummary = calculateDCASummary(ethPurchases, currentEthPrice);
  const btcSummary = calculateDCASummary(btcPurchases, currentBtcPrice);
  
  // Calculate combined summary
  const combinedSummary: DCASummary = {
    totalInvested: ethSummary.totalInvested + btcSummary.totalInvested,
    totalAmount: 0, // Not applicable for combined (different units)
    averageCostBasis: 0, // Not applicable for combined (different units)
    currentValue: ethSummary.currentValue + btcSummary.currentValue,
    profitLoss: ethSummary.profitLoss + btcSummary.profitLoss,
    profitLossPercentage: 0
  };
  
  // Calculate percentage if there's any investment
  if (combinedSummary.totalInvested > 0) {
    combinedSummary.profitLossPercentage = (combinedSummary.profitLoss / combinedSummary.totalInvested) * 100;
  }
  
  return {
    ETH: ethSummary,
    BTC: btcSummary,
    combined: combinedSummary
  };
};

// Format USD values
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Format crypto values
export const formatCrypto = (value: number, type: CryptoType): string => {
  return `${value.toFixed(type === 'BTC' ? 8 : 6)} ${type}`;
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
    const ethAmount = calculateCryptoAmount(amountUSD, ethPrice);
    
    sampleData.unshift({
      id: `eth-purchase-${i}`,
      date,
      amountUSD,
      price: ethPrice,
      amount: ethAmount,
      cryptoType: 'ETH'
    });

    // Also generate BTC purchases
    if (i < 6) { // Fewer BTC purchases for variety
      const btcDate = new Date(date);
      btcDate.setDate(btcDate.getDate() + 15); // Offset by 15 days
      
      // Generate BTC price between $20,000 and $50,000
      const btcPrice = 20000 + Math.random() * 30000;
      const btcAmountUSD = 300; // Different DCA amount for BTC
      const btcAmount = calculateCryptoAmount(btcAmountUSD, btcPrice);
      
      sampleData.unshift({
        id: `btc-purchase-${i}`,
        date: btcDate,
        amountUSD: btcAmountUSD,
        price: btcPrice,
        amount: btcAmount,
        cryptoType: 'BTC'
      });
    }
  }
  
  // Sort all purchases by date
  return sampleData.sort((a, b) => a.date.getTime() - b.date.getTime());
};

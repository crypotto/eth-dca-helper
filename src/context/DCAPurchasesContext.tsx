
import React, { createContext, useState, useEffect } from 'react';
import { DCAPurchase, CryptoSummary, CryptoType } from '@/types/eth';
import { calculateCryptoSummaries, generateSampleData } from '@/utils/ethUtils';

interface DCAPurchasesContextType {
  purchases: DCAPurchase[];
  currentEthPrice: number;
  currentBtcPrice: number;
  summary: CryptoSummary;
  addPurchase: (purchase: DCAPurchase) => void;
  deletePurchase: (id: string) => void;
  updateCurrentPrice: (price: number, cryptoType: CryptoType) => void;
}

export const DCAPurchasesContext = createContext<DCAPurchasesContextType>({
  purchases: [],
  currentEthPrice: 0,
  currentBtcPrice: 0,
  summary: {
    ETH: {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    BTC: {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    combined: {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    }
  },
  addPurchase: () => {},
  deletePurchase: () => {},
  updateCurrentPrice: () => {}
});

interface DCAPurchasesProviderProps {
  children: React.ReactNode;
}

export const DCAPurchasesProvider: React.FC<DCAPurchasesProviderProps> = ({ children }) => {
  const [purchases, setPurchases] = useState<DCAPurchase[]>([]);
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(2750); // Default ETH price
  const [currentBtcPrice, setCurrentBtcPrice] = useState<number>(35000); // Default BTC price
  const [summary, setSummary] = useState<CryptoSummary>({
    ETH: {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    BTC: {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    combined: {
      totalInvested: 0,
      totalAmount: 0,
      averageCostBasis: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    }
  });

  // Effect to load data from local storage on initial render
  useEffect(() => {
    try {
      const savedPurchases = localStorage.getItem('dcaPurchases');
      const savedEthPrice = localStorage.getItem('currentEthPrice');
      const savedBtcPrice = localStorage.getItem('currentBtcPrice');
      
      if (savedPurchases) {
        const parsedPurchases = JSON.parse(savedPurchases).map((p: any) => ({
          ...p,
          date: new Date(p.date),
          // Ensure cryptoType is set for backward compatibility
          cryptoType: p.cryptoType || 'ETH'
        }));
        setPurchases(parsedPurchases);
      } else {
        // Load sample data if no saved data exists
        setPurchases(generateSampleData());
      }
      
      if (savedEthPrice) {
        setCurrentEthPrice(parseFloat(savedEthPrice));
      }
      
      if (savedBtcPrice) {
        setCurrentBtcPrice(parseFloat(savedBtcPrice));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Load sample data if there's an error
      setPurchases(generateSampleData());
    }
  }, []);

  // Effect to save purchases to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dcaPurchases', JSON.stringify(purchases));
    } catch (error) {
      console.error('Error saving purchases to localStorage:', error);
    }
  }, [purchases]);

  // Effect to save current crypto prices to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('currentEthPrice', currentEthPrice.toString());
      localStorage.setItem('currentBtcPrice', currentBtcPrice.toString());
    } catch (error) {
      console.error('Error saving crypto prices to localStorage:', error);
    }
  }, [currentEthPrice, currentBtcPrice]);

  // Effect to recalculate summary whenever purchases or crypto prices change
  useEffect(() => {
    const newSummary = calculateCryptoSummaries(purchases, currentEthPrice, currentBtcPrice);
    setSummary(newSummary);
  }, [purchases, currentEthPrice, currentBtcPrice]);

  // Add a new DCA purchase
  const addPurchase = (purchase: DCAPurchase) => {
    setPurchases(prev => [...prev, purchase].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  // Delete a DCA purchase
  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  // Update the current price for a specific cryptocurrency
  const updateCurrentPrice = (price: number, cryptoType: CryptoType) => {
    if (cryptoType === 'ETH') {
      setCurrentEthPrice(price);
    } else {
      setCurrentBtcPrice(price);
    }
  };

  return (
    <DCAPurchasesContext.Provider
      value={{
        purchases,
        currentEthPrice,
        currentBtcPrice,
        summary,
        addPurchase,
        deletePurchase,
        updateCurrentPrice
      }}
    >
      {children}
    </DCAPurchasesContext.Provider>
  );
};

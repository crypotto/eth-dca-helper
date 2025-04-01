
import React, { createContext, useState, useEffect } from 'react';
import { DCAPurchase, DCASummary } from '@/types/eth';
import { calculateDCASummary, generateSampleData } from '@/utils/ethUtils';

interface DCAPurchasesContextType {
  purchases: DCAPurchase[];
  currentEthPrice: number;
  summary: DCASummary;
  addPurchase: (purchase: DCAPurchase) => void;
  deletePurchase: (id: string) => void;
  updateCurrentEthPrice: (price: number) => void;
}

export const DCAPurchasesContext = createContext<DCAPurchasesContextType>({
  purchases: [],
  currentEthPrice: 0,
  summary: {
    totalInvested: 0,
    totalEth: 0,
    averageCostBasis: 0,
    currentValue: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  },
  addPurchase: () => {},
  deletePurchase: () => {},
  updateCurrentEthPrice: () => {}
});

interface DCAPurchasesProviderProps {
  children: React.ReactNode;
}

export const DCAPurchasesProvider: React.FC<DCAPurchasesProviderProps> = ({ children }) => {
  const [purchases, setPurchases] = useState<DCAPurchase[]>([]);
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(2750); // Default price
  const [summary, setSummary] = useState<DCASummary>({
    totalInvested: 0,
    totalEth: 0,
    averageCostBasis: 0,
    currentValue: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  });

  // Effect to load data from local storage on initial render
  useEffect(() => {
    try {
      const savedPurchases = localStorage.getItem('dcaPurchases');
      const savedEthPrice = localStorage.getItem('currentEthPrice');
      
      if (savedPurchases) {
        const parsedPurchases = JSON.parse(savedPurchases).map((p: any) => ({
          ...p,
          date: new Date(p.date)
        }));
        setPurchases(parsedPurchases);
      } else {
        // Load sample data if no saved data exists
        setPurchases(generateSampleData());
      }
      
      if (savedEthPrice) {
        setCurrentEthPrice(parseFloat(savedEthPrice));
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

  // Effect to save current ETH price to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('currentEthPrice', currentEthPrice.toString());
    } catch (error) {
      console.error('Error saving ETH price to localStorage:', error);
    }
  }, [currentEthPrice]);

  // Effect to recalculate summary whenever purchases or ETH price changes
  useEffect(() => {
    const newSummary = calculateDCASummary(purchases, currentEthPrice);
    setSummary(newSummary);
  }, [purchases, currentEthPrice]);

  // Add a new DCA purchase
  const addPurchase = (purchase: DCAPurchase) => {
    setPurchases(prev => [...prev, purchase].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  // Delete a DCA purchase
  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  // Update the current ETH price
  const updateCurrentEthPrice = (price: number) => {
    setCurrentEthPrice(price);
  };

  return (
    <DCAPurchasesContext.Provider
      value={{
        purchases,
        currentEthPrice,
        summary,
        addPurchase,
        deletePurchase,
        updateCurrentEthPrice
      }}
    >
      {children}
    </DCAPurchasesContext.Provider>
  );
};

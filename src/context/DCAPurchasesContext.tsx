
import React, { createContext, useState, useEffect } from 'react';
import { DCAPurchase, CryptoSummary, CryptoType } from '@/types/eth';
import { calculateCryptoSummaries, generateSampleData } from '@/utils/ethUtils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

interface DCAPurchasesContextType {
  purchases: DCAPurchase[];
  currentEthPrice: number;
  currentBtcPrice: number;
  summary: CryptoSummary;
  addPurchase: (purchase: DCAPurchase) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
  updateCurrentPrice: (price: number, cryptoType: CryptoType) => Promise<void>;
  isLoading: boolean;
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
  addPurchase: async () => {},
  deletePurchase: async () => {},
  updateCurrentPrice: async () => {},
  isLoading: true
});

interface DCAPurchasesProviderProps {
  children: React.ReactNode;
}

export const DCAPurchasesProvider: React.FC<DCAPurchasesProviderProps> = ({ children }) => {
  const [purchases, setPurchases] = useState<DCAPurchase[]>([]);
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(2750);
  const [currentBtcPrice, setCurrentBtcPrice] = useState<number>(35000);
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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load user data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch user's DCA purchases
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('dca_purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (purchasesError) {
          throw purchasesError;
        }

        // Fetch user's price settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw settingsError;
        }

        // Transform purchased data to match DCAPurchase type
        const transformedPurchases: DCAPurchase[] = purchasesData ? purchasesData.map(p => ({
          id: p.id,
          date: new Date(p.date),
          amountUSD: p.amount_usd,
          price: p.price,
          amount: p.amount,
          cryptoType: p.crypto_type as CryptoType
        })) : [];

        setPurchases(transformedPurchases);

        // Set price settings if they exist
        if (settingsData) {
          setCurrentEthPrice(settingsData.current_eth_price);
          setCurrentBtcPrice(settingsData.current_btc_price);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive",
        });

        // If this is the first time loading (no data), create sample data
        if (purchases.length === 0) {
          const sampleData = generateSampleData();
          setPurchases(sampleData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Effect to recalculate summary whenever purchases or crypto prices change
  useEffect(() => {
    const newSummary = calculateCryptoSummaries(purchases, currentEthPrice, currentBtcPrice);
    setSummary(newSummary);
  }, [purchases, currentEthPrice, currentBtcPrice]);

  // Save current prices to Supabase
  const savePrices = async (ethPrice: number, btcPrice: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          current_eth_price: ethPrice,
          current_btc_price: btcPrice,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error saving prices:', error);
      toast({
        title: "Error saving prices",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add a new DCA purchase
  const addPurchase = async (purchase: DCAPurchase) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save purchases",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a proper UUID using the uuid library
      const purchaseId = uuidv4();
      
      // Insert into Supabase
      const { error } = await supabase
        .from('dca_purchases')
        .insert({
          id: purchaseId,
          user_id: user.id,
          date: purchase.date.toISOString(),
          amount_usd: purchase.amountUSD,
          price: purchase.price,
          amount: purchase.amount,
          crypto_type: purchase.cryptoType
        });

      if (error) throw error;

      // Update local state with the UUID
      const purchaseWithId = {
        ...purchase,
        id: purchaseId
      };

      // Update local state
      setPurchases(prev => 
        [...prev, purchaseWithId].sort((a, b) => a.date.getTime() - b.date.getTime())
      );

      toast({
        title: "Purchase added",
        description: `Successfully added ${purchase.cryptoType} purchase`,
      });
    } catch (error: any) {
      console.error('Error adding purchase:', error);
      toast({
        title: "Error adding purchase",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete a DCA purchase
  const deletePurchase = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dca_purchases')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPurchases(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Purchase deleted",
        description: "Transaction has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting purchase:', error);
      toast({
        title: "Error deleting purchase",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update the current price for a specific cryptocurrency
  const updateCurrentPrice = async (price: number, cryptoType: CryptoType) => {
    if (cryptoType === 'ETH') {
      setCurrentEthPrice(price);
      if (user) {
        await savePrices(price, currentBtcPrice);
      }
    } else {
      setCurrentBtcPrice(price);
      if (user) {
        await savePrices(currentEthPrice, price);
      }
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
        updateCurrentPrice,
        isLoading
      }}
    >
      {children}
    </DCAPurchasesContext.Provider>
  );
};

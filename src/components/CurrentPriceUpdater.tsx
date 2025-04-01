
import React, { useState, useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';
import { CryptoType } from '@/types/eth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EthLogo from './EthLogo';
import BtcLogo from './BtcLogo';

const CurrentPriceUpdater: React.FC = () => {
  const { currentEthPrice, currentBtcPrice, updateCurrentPrice } = useContext(DCAPurchasesContext);
  const [ethPrice, setEthPrice] = useState<string>(currentEthPrice.toString());
  const [btcPrice, setBtcPrice] = useState<string>(currentBtcPrice.toString());
  const [activeTab, setActiveTab] = useState<CryptoType>('ETH');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent, type: CryptoType) => {
    e.preventDefault();
    
    const price = type === 'ETH' ? parseFloat(ethPrice) : parseFloat(btcPrice);
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: `Please enter a valid price greater than zero`,
        variant: "destructive"
      });
      return;
    }
    
    updateCurrentPrice(price, type);
    
    toast({
      title: "Price updated",
      description: `Current ${type} price has been updated`
    });
  };

  const fetchCurrentPrice = async (type: CryptoType) => {
    try {
      const cryptoId = type === 'ETH' ? 'ethereum' : 'bitcoin';
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`);
      const data = await response.json();
      
      if (data && data[cryptoId] && data[cryptoId].usd) {
        const fetchedPrice = data[cryptoId].usd;
        
        if (type === 'ETH') {
          setEthPrice(fetchedPrice.toString());
        } else {
          setBtcPrice(fetchedPrice.toString());
        }
        
        updateCurrentPrice(fetchedPrice, type);
        
        toast({
          title: "Price updated",
          description: `Current ${type} price fetched: $${fetchedPrice.toFixed(2)}`
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(`Error fetching ${type} price:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch current ${type} price. Please try again later or enter manually.`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Current Prices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CryptoType)}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="ETH" className="flex items-center w-1/2">
              <EthLogo size={16} className="mr-2" /> Ethereum
            </TabsTrigger>
            <TabsTrigger value="BTC" className="flex items-center w-1/2">
              <BtcLogo size={16} className="mr-2" /> Bitcoin
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ETH">
            <form onSubmit={(e) => handleSubmit(e, 'ETH')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ethPrice">Current ETH Price (USD)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="ethPrice"
                    type="number"
                    placeholder="Enter current ETH price"
                    value={ethPrice}
                    onChange={(e) => setEthPrice(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <Button type="button" variant="outline" onClick={() => fetchCurrentPrice('ETH')} title="Fetch current price">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#627EEA]/90 hover:bg-[#627EEA]">Update ETH Price</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="BTC">
            <form onSubmit={(e) => handleSubmit(e, 'BTC')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="btcPrice">Current BTC Price (USD)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="btcPrice"
                    type="number"
                    placeholder="Enter current BTC price"
                    value={btcPrice}
                    onChange={(e) => setBtcPrice(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <Button type="button" variant="outline" onClick={() => fetchCurrentPrice('BTC')} title="Fetch current price">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#F7931A]/90 hover:bg-[#F7931A]">Update BTC Price</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurrentPriceUpdater;

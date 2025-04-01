
import React, { useState, useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

const CurrentPriceUpdater: React.FC = () => {
  const { currentEthPrice, updateCurrentEthPrice } = useContext(DCAPurchasesContext);
  const [price, setPrice] = useState<string>(currentEthPrice.toString());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrice = parseFloat(price);
    
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    updateCurrentEthPrice(newPrice);
    
    toast({
      title: "Price updated",
      description: "Current ETH price has been updated"
    });
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      
      if (data && data.ethereum && data.ethereum.usd) {
        const fetchedPrice = data.ethereum.usd;
        setPrice(fetchedPrice.toString());
        updateCurrentEthPrice(fetchedPrice);
        
        toast({
          title: "Price updated",
          description: `Current ETH price fetched: $${fetchedPrice.toFixed(2)}`
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      toast({
        title: "Error",
        description: "Failed to fetch current ETH price. Please try again later or enter manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Current ETH Price</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPrice">Current ETH Price (USD)</Label>
            <div className="flex space-x-2">
              <Input
                id="currentPrice"
                type="number"
                placeholder="Enter current ETH price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
              />
              <Button type="button" variant="outline" onClick={fetchCurrentPrice} title="Fetch current price">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">Update Price</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CurrentPriceUpdater;

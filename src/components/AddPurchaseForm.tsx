
import React, { useState, useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { calculateCryptoAmount } from '@/utils/ethUtils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CryptoType } from '@/types/eth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddPurchaseForm: React.FC = () => {
  const { addPurchase } = useContext(DCAPurchasesContext);
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [amountUSD, setAmountUSD] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [cryptoType, setCryptoType] = useState<CryptoType>('ETH');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !amountUSD || !price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const amountUSDNumber = parseFloat(amountUSD);
    const priceNumber = parseFloat(price);

    if (isNaN(amountUSDNumber) || isNaN(priceNumber)) {
      toast({
        title: "Error",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    if (amountUSDNumber <= 0 || priceNumber <= 0) {
      toast({
        title: "Error",
        description: "Values must be greater than zero",
        variant: "destructive"
      });
      return;
    }

    const cryptoAmount = calculateCryptoAmount(amountUSDNumber, priceNumber);
    
    addPurchase({
      id: `purchase-${Date.now()}`,
      date,
      amountUSD: amountUSDNumber,
      price: priceNumber,
      amount: cryptoAmount,
      cryptoType
    });

    toast({
      title: "Purchase added",
      description: `Your DCA purchase of ${cryptoType} has been successfully recorded`
    });

    // Reset form
    setAmountUSD('');
    setPrice('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add DCA Purchase</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Purchase Date</Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date || new Date());
                    setIsOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cryptoType">Cryptocurrency</Label>
            <Select
              value={cryptoType}
              onValueChange={(value) => setCryptoType(value as CryptoType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountUSD">Amount (USD)</Label>
            <Input
              id="amountUSD"
              type="number"
              placeholder="e.g., 250"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{cryptoType} Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder={`e.g., ${cryptoType === 'ETH' ? '3000' : '30000'}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          {amountUSD && price && !isNaN(parseFloat(amountUSD)) && !isNaN(parseFloat(price)) && (
            <div className="text-sm text-muted-foreground">
              You'll receive approximately {(parseFloat(amountUSD) / parseFloat(price)).toFixed(cryptoType === 'BTC' ? 8 : 6)} {cryptoType}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Add Purchase</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddPurchaseForm;

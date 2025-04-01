
import React from 'react';
import { useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { formatUSD } from '@/utils/ethUtils';
import { CryptoType } from '@/types/eth';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ComposedChart, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

interface ChartData {
  date: string;
  price: number;
  amount: number;
  investment: number;
  cumulativeAmount: number;
  averageCostBasis: number;
  cryptoType?: CryptoType;
}

interface DCAPurchaseChartProps {
  cryptoType?: CryptoType;
}

const DCAPurchaseChart: React.FC<DCAPurchaseChartProps> = ({ cryptoType }) => {
  const { purchases, currentEthPrice, currentBtcPrice } = useContext(DCAPurchasesContext);

  // Filter purchases by crypto type if specified
  const filteredPurchases = cryptoType
    ? purchases.filter(p => p.cryptoType === cryptoType)
    : purchases;

  // Determine chart color based on crypto type
  const getChartColor = (type: CryptoType) => {
    return type === 'ETH' ? '#627EEA' : '#F7931A';
  };

  // Prepare the data for the chart
  const chartData: ChartData[] = filteredPurchases.map((purchase, index) => {
    // For combined view, we need to calculate cumulative values by crypto type
    const purchasesOfSameType = filteredPurchases
      .filter(p => cryptoType ? true : p.cryptoType === purchase.cryptoType)
      .filter((_, i) => i <= index);
    
    const cumulativeAmount = purchasesOfSameType
      .reduce((total, p) => total + p.amount, 0);
    
    const totalInvested = purchasesOfSameType
      .reduce((total, p) => total + p.amountUSD, 0);
    
    const averageCostBasis = totalInvested / cumulativeAmount;

    return {
      date: purchase.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: purchase.price,
      amount: purchase.amount,
      investment: purchase.amountUSD,
      cumulativeAmount,
      averageCostBasis,
      cryptoType: purchase.cryptoType
    };
  });

  // For combined view, we need a different approach
  if (!cryptoType) {
    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Portfolio Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'ETH Investment' || name === 'BTC Investment') {
                    return [formatUSD(value), name];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="investment" 
                name="Investment" 
                fill="#7E69AB"
                stackId="investment"
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10B981" 
                name="Price" 
                dot={false}
                legendType="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Single crypto type view
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{cryptoType} Price vs. Your Average Cost</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip 
              formatter={(value: number) => [formatUSD(value)]} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={getChartColor(cryptoType)} 
              strokeWidth={2} 
              dot={false} 
              name={`${cryptoType} Price`}
            />
            <Line 
              type="monotone" 
              dataKey="averageCostBasis" 
              stroke="#28324E" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              name="Your Avg. Cost"
            />
            {(cryptoType === 'ETH' ? currentEthPrice : currentBtcPrice) && (
              <Line 
                dataKey={() => cryptoType === 'ETH' ? currentEthPrice : currentBtcPrice} 
                stroke="#10B981" 
                strokeWidth={2} 
                dot={false} 
                name="Current Price" 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Accumulated {cryptoType} Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value.toFixed(cryptoType === 'BTC' ? 4 : 2)} ${cryptoType}`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(cryptoType === 'BTC' ? 8 : 6)} ${cryptoType}`]} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="cumulativeAmount" 
              stroke={getChartColor(cryptoType)} 
              fill={cryptoType === 'ETH' ? '#C7D7EB' : '#FCE5C8'} 
              name={`Total ${cryptoType}`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Monthly Investments</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [formatUSD(value)]} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="investment" 
              fill={getChartColor(cryptoType)} 
              name="USD Invested" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DCAPurchaseChart;

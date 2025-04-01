
import React from 'react';
import { useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { formatUSD } from '@/utils/ethUtils';
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
  ethPrice: number;
  ethAmount: number;
  investment: number;
  cumulativeEth: number;
  averageCostBasis: number;
}

const DCAPurchaseChart: React.FC = () => {
  const { purchases, currentEthPrice } = useContext(DCAPurchasesContext);

  // Prepare the data for the chart
  const chartData: ChartData[] = purchases.map((purchase, index) => {
    const cumulativeEth = purchases
      .slice(0, index + 1)
      .reduce((total, p) => total + p.ethAmount, 0);
    
    const totalInvested = purchases
      .slice(0, index + 1)
      .reduce((total, p) => total + p.amountUSD, 0);
    
    const averageCostBasis = totalInvested / cumulativeEth;

    return {
      date: purchase.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      ethPrice: purchase.ethPrice,
      ethAmount: purchase.ethAmount,
      investment: purchase.amountUSD,
      cumulativeEth,
      averageCostBasis
    };
  });

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">ETH Price vs. Your Average Cost</h3>
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
              dataKey="ethPrice" 
              stroke="#627EEA" 
              strokeWidth={2} 
              dot={false} 
              name="ETH Price"
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
            {currentEthPrice && (
              <Line 
                dataKey={() => currentEthPrice} 
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
        <h3 className="text-lg font-medium">Accumulated ETH Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value.toFixed(2)} ETH`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(6)} ETH`]} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="cumulativeEth" 
              stroke="#627EEA" 
              fill="#C7D7EB" 
              name="Total ETH"
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
            <Bar dataKey="investment" fill="#627EEA" name="USD Invested" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DCAPurchaseChart;

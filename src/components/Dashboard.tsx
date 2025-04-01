
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DCASummary } from '@/types/eth';
import { formatETH, formatUSD, formatPercentage } from '@/utils/ethUtils';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DCAPurchaseChart from './DCAPurchaseChart';
import DCAPurchaseTable from './DCAPurchaseTable';
import EthLogo from './EthLogo';

interface DashboardProps {
  summary: DCASummary;
  currentEthPrice: number;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, currentEthPrice }) => {
  const isProfit = summary.profitLoss >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ETH DCA Tracker</h1>
          <p className="text-muted-foreground">Track and optimize your Ethereum DCA strategy</p>
        </div>
        <div className="flex items-center p-2 bg-eth-light/20 rounded-lg">
          <EthLogo size={20} className="mr-2" />
          <span className="font-medium">Current ETH Price: {formatUSD(currentEthPrice)}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUSD(summary.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">Across all DCA purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ETH</CardTitle>
            <EthLogo size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatETH(summary.totalEth)}</div>
            <p className="text-xs text-muted-foreground">Accumulated ETH</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost Basis</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUSD(summary.averageCostBasis)}</div>
            <p className="text-xs text-muted-foreground">Per ETH</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-2xl font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {formatUSD(Math.abs(summary.profitLoss))}
              </div>
              <span className={`ml-2 text-sm ${isProfit ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {isProfit ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {formatPercentage(Math.abs(summary.profitLossPercentage))}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Current value: {formatUSD(summary.currentValue)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="table">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>DCA Performance</CardTitle>
              <CardDescription>Your dollar-cost averaging performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <DCAPurchaseChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>DCA Transactions</CardTitle>
              <CardDescription>A history of all your ETH purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <DCAPurchaseTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

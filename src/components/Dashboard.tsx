import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CryptoSummary, CryptoType } from '@/types/eth';
import { formatCrypto, formatUSD, formatPercentage } from '@/utils/ethUtils';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Ellipsis } from 'lucide-react';
import DCAPurchaseChart from './DCAPurchaseChart';
import DCAPurchaseTable from './DCAPurchaseTable';
import EthLogo from './EthLogo';
import BtcLogo from './BtcLogo';

interface DashboardProps {
  summary: CryptoSummary;
  currentEthPrice: number;
  currentBtcPrice: number;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, currentEthPrice, currentBtcPrice }) => {
  const [activeCrypto, setActiveCrypto] = useState<'combined' | CryptoType>('combined');
  
  const renderSummaryCards = () => {
    const currentSummary = activeCrypto === 'combined' 
      ? summary.combined 
      : summary[activeCrypto];
    
    const isProfit = currentSummary.profitLoss >= 0;
    
    const currentPrice = activeCrypto === 'ETH' 
      ? currentEthPrice 
      : activeCrypto === 'BTC' 
        ? currentBtcPrice 
        : null;

    return (
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
            <div className="text-2xl font-bold">{formatUSD(currentSummary.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">Across all DCA purchases</p>
          </CardContent>
        </Card>

        {activeCrypto !== 'combined' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total {activeCrypto}</CardTitle>
              {activeCrypto === 'ETH' 
                ? <EthLogo size={16} className="text-muted-foreground" /> 
                : <BtcLogo size={16} className="text-muted-foreground" />
              }
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCrypto(currentSummary.totalAmount, activeCrypto)}</div>
              <p className="text-xs text-muted-foreground">Accumulated {activeCrypto}</p>
            </CardContent>
          </Card>
        )}

        {activeCrypto !== 'combined' && (
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
              <div className="text-2xl font-bold">{formatUSD(currentSummary.averageCostBasis)}</div>
              <p className="text-xs text-muted-foreground">Per {activeCrypto}</p>
            </CardContent>
          </Card>
        )}

        <Card className={activeCrypto === 'combined' ? 'md:col-span-2 lg:col-span-2' : ''}>
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
                {formatUSD(Math.abs(currentSummary.profitLoss))}
              </div>
              <span className={`ml-2 text-sm ${isProfit ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {isProfit ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {formatPercentage(Math.abs(currentSummary.profitLossPercentage))}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Current value: {formatUSD(currentSummary.currentValue)}</p>
          </CardContent>
        </Card>

        {activeCrypto === 'combined' && (
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Distribution</CardTitle>
              <Ellipsis className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <EthLogo size={20} className="mr-2" />
                    <span>Ethereum</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatUSD(summary.ETH.currentValue)}</div>
                    <div className="text-xs text-muted-foreground">
                      {summary.combined.currentValue > 0 
                        ? formatPercentage((summary.ETH.currentValue / summary.combined.currentValue) * 100) 
                        : '0%'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BtcLogo size={20} className="mr-2" />
                    <span>Bitcoin</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatUSD(summary.BTC.currentValue)}</div>
                    <div className="text-xs text-muted-foreground">
                      {summary.combined.currentValue > 0 
                        ? formatPercentage((summary.BTC.currentValue / summary.combined.currentValue) * 100) 
                        : '0%'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crypto DCA Tracker</h1>
          <p className="text-muted-foreground">Track and optimize your cryptocurrency DCA strategy</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center p-2 bg-[#627EEA]/20 rounded-lg">
            <EthLogo size={20} className="mr-2" />
            <span className="font-medium">ETH: {formatUSD(currentEthPrice)}</span>
          </div>
          <div className="flex items-center p-2 bg-[#F7931A]/20 rounded-lg">
            <BtcLogo size={20} className="mr-2" />
            <span className="font-medium">BTC: {formatUSD(currentBtcPrice)}</span>
          </div>
        </div>
      </div>

      <Tabs value={activeCrypto} onValueChange={(value) => setActiveCrypto(value as 'combined' | CryptoType)}>
        <TabsList className="bg-white border">
          <TabsTrigger value="combined">
            Combined
          </TabsTrigger>
          <TabsTrigger value="ETH">
            <EthLogo size={16} className="mr-1" /> ETH
          </TabsTrigger>
          <TabsTrigger value="BTC">
            <BtcLogo size={16} className="mr-1" /> BTC
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {renderSummaryCards()}

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
              <DCAPurchaseChart cryptoType={activeCrypto === 'combined' ? undefined : activeCrypto} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>DCA Transactions</CardTitle>
              <CardDescription>A history of all your crypto purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <DCAPurchaseTable cryptoType={activeCrypto === 'combined' ? undefined : activeCrypto} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

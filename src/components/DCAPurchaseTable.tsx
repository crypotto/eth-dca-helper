
import React, { useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { formatUSD, formatCrypto } from '@/utils/ethUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CryptoType } from '@/types/eth';
import EthLogo from './EthLogo';
import BtcLogo from './BtcLogo';

interface DCAPurchaseTableProps {
  cryptoType?: CryptoType;
}

const DCAPurchaseTable: React.FC<DCAPurchaseTableProps> = ({ cryptoType }) => {
  const { purchases } = useContext(DCAPurchasesContext);
  
  // Filter purchases based on cryptoType if provided
  const filteredPurchases = cryptoType 
    ? purchases.filter(p => p.cryptoType === cryptoType)
    : purchases;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {!cryptoType && <TableHead>Crypto</TableHead>}
            <TableHead>Amount (USD)</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Crypto Purchased</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPurchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.date.toLocaleDateString()}</TableCell>
              {!cryptoType && (
                <TableCell>
                  <div className="flex items-center">
                    {purchase.cryptoType === 'ETH' 
                      ? <EthLogo size={16} className="mr-1" /> 
                      : <BtcLogo size={16} className="mr-1" />
                    }
                    {purchase.cryptoType}
                  </div>
                </TableCell>
              )}
              <TableCell>{formatUSD(purchase.amountUSD)}</TableCell>
              <TableCell>{formatUSD(purchase.price)}</TableCell>
              <TableCell>{formatCrypto(purchase.amount, purchase.cryptoType)}</TableCell>
            </TableRow>
          ))}
          {filteredPurchases.length === 0 && (
            <TableRow>
              <TableCell colSpan={cryptoType ? 4 : 5} className="text-center h-24 text-muted-foreground">
                No purchases yet. Add your first DCA purchase to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DCAPurchaseTable;


import React, { useContext } from 'react';
import { DCAPurchasesContext } from '@/context/DCAPurchasesContext';
import { formatUSD, formatETH } from '@/utils/ethUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DCAPurchaseTable: React.FC = () => {
  const { purchases } = useContext(DCAPurchasesContext);

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount (USD)</TableHead>
            <TableHead>ETH Price</TableHead>
            <TableHead>ETH Purchased</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.date.toLocaleDateString()}</TableCell>
              <TableCell>{formatUSD(purchase.amountUSD)}</TableCell>
              <TableCell>{formatUSD(purchase.ethPrice)}</TableCell>
              <TableCell>{formatETH(purchase.ethAmount)}</TableCell>
            </TableRow>
          ))}
          {purchases.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
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

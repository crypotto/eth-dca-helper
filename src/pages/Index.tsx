
import { DCAPurchasesProvider } from "@/context/DCAPurchasesContext";
import Dashboard from "@/components/Dashboard";
import AddPurchaseForm from "@/components/AddPurchaseForm";
import CurrentPriceUpdater from "@/components/CurrentPriceUpdater";
import { useContext } from "react";
import { DCAPurchasesContext } from "@/context/DCAPurchasesContext";

// Wrapper component to use context
const DCADashboardWithContext = () => {
  const { summary, currentEthPrice } = useContext(DCAPurchasesContext);
  
  return <Dashboard summary={summary} currentEthPrice={currentEthPrice} />;
};

const Index = () => {
  return (
    <DCAPurchasesProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <DCADashboardWithContext />
          
          <div className="grid gap-6 mt-8 md:grid-cols-2">
            <AddPurchaseForm />
            <CurrentPriceUpdater />
          </div>
        </div>
      </div>
    </DCAPurchasesProvider>
  );
};

export default Index;

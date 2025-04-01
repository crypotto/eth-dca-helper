
import { DCAPurchasesProvider } from "@/context/DCAPurchasesContext";
import Dashboard from "@/components/Dashboard";
import AddPurchaseForm from "@/components/AddPurchaseForm";
import CurrentPriceUpdater from "@/components/CurrentPriceUpdater";
import { useContext } from "react";
import { DCAPurchasesContext } from "@/context/DCAPurchasesContext";
import UserMenu from "@/components/UserMenu";

// Wrapper component to use context
const DCADashboardWithContext = () => {
  const { summary, currentEthPrice, currentBtcPrice, isLoading } = useContext(DCAPurchasesContext);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Dashboard 
    summary={summary} 
    currentEthPrice={currentEthPrice} 
    currentBtcPrice={currentBtcPrice} 
  />;
};

const Index = () => {
  return (
    <DCAPurchasesProvider>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex justify-end mb-4">
            <UserMenu />
          </div>

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

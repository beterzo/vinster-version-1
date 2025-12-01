
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { JourneyResetProvider } from "@/contexts/JourneyResetContext";
import SEOHead from "@/components/SEOHead";
import AppRouter from "@/components/AppRouter";
import CookieBanner from "@/components/CookieBanner";
import CookieSettings from "@/components/CookieSettings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <JourneyResetProvider>
              <AuthProvider>
                <SEOHead />
                <AppRouter />
                <CookieBanner />
                <CookieSettings />
              </AuthProvider>
            </JourneyResetProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

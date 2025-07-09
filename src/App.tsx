
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import TitleManager from "@/components/TitleManager";
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
            <AuthProvider>
              <TitleManager />
              <AppRouter />
              <CookieBanner />
              <CookieSettings />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

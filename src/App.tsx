import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";
import PaymentRequired from "./pages/PaymentRequired";
import DeMensAchterVinster from "./pages/DeMensAchterVinster";
import EnthousiasmeIntro from "./pages/EnthousiasmeIntro";
import EnthousiasmeStep1 from "./pages/EnthousiasmeStep1";
import EnthousiasmeStep2 from "./pages/EnthousiasmeStep2";
import EnthousiasmeStep3 from "./pages/EnthousiasmeStep3";
import WensberoepenIntro from "./pages/WensberoepenIntro";
import WensberoepenStep1 from "./pages/WensberoepenStep1";
import WensberoepenStep2 from "./pages/WensberoepenStep2";
import WensberoepenStep3 from "./pages/WensberoepenStep3";
import WensberoepenVoltooiPagina from "./pages/WensberoepenVoltooiPagina";
import ProfielVoltooienIntro from "./pages/ProfielVoltooienIntro";
import ExtraInformatieVragen from "./pages/ExtraInformatieVragen";
import PrioriteitenActiviteiten from "./pages/PrioriteitenActiviteiten";
import PrioriteitenInteresses from "./pages/PrioriteitenInteresses";
import PrioriteitenWerkomstandigheden from "./pages/PrioriteitenWerkomstandigheden";
import RapportReview from "./pages/RapportReview";
import RapportDownload from "./pages/RapportDownload";
import OnderzoeksplanPagina from "./pages/OnderzoeksplanPagina";
import FunctieprofielIntro from "./pages/FunctieprofielIntro";
import FunctieprofielVragen from "./pages/FunctieprofielVragen";
import FunctieprofielDownload from "./pages/FunctieprofielDownload";

const queryClient = new QueryClient();

const App = () => {
  // Global title manager - ensures all pages show "Vinster" as title
  useEffect(() => {
    document.title = "Vinster";
    
    // Create a mutation observer to watch for title changes and revert them
    const observer = new MutationObserver(() => {
      if (document.title !== "Vinster") {
        document.title = "Vinster";
      }
    });
    
    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/email-verification" element={<EmailVerificationPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route 
                path="/payment-required" 
                element={
                  <ProtectedRoute requirePayment={false}>
                    <PaymentRequired />
                  </ProtectedRoute>
                } 
              />
              <Route path="/de-mens-achter-vinster" element={<DeMensAchterVinster />} />
              
              {/* Protected routes that require payment */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/enthousiasme-intro"
                element={
                  <ProtectedRoute>
                    <EnthousiasmeIntro />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/enthousiasme-step-1"
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep1 />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/enthousiasme-step-2"
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep2 />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/enthousiasme-step-3"
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep3 />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/wensberoepen-intro"
                element={
                  <ProtectedRoute>
                    <WensberoepenIntro />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/wensberoepen-step-1"
                element={
                  <ProtectedRoute>
                    <WensberoepenStep1 />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/wensberoepen-step-2"
                element={
                  <ProtectedRoute>
                    <WensberoepenStep2 />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/wensberoepen-step-3"
                element={
                  <ProtectedRoute>
                    <WensberoepenStep3 />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/wensberoepen-voltooi"
                element={
                  <ProtectedRoute>
                    <WensberoepenVoltooiPagina />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profiel-voltooien-intro"
                element={
                  <ProtectedRoute>
                    <ProfielVoltooienIntro />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/extra-informatie-vragen"
                element={
                  <ProtectedRoute>
                    <ExtraInformatieVragen />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/prioriteiten-activiteiten"
                element={
                  <ProtectedRoute>
                    <PrioriteitenActiviteiten />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/prioriteiten-interesses"
                element={
                  <ProtectedRoute>
                    <PrioriteitenInteresses />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/prioriteiten-werkomstandigheden"
                element={
                  <ProtectedRoute>
                    <PrioriteitenWerkomstandigheden />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/rapport-review"
                element={
                  <ProtectedRoute>
                    <RapportReview />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/rapport-download"
                element={
                  <ProtectedRoute>
                    <RapportDownload />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/onderzoeksplan"
                element={
                  <ProtectedRoute>
                    <OnderzoeksplanPagina />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/functieprofiel-intro"
                element={
                  <ProtectedRoute>
                    <FunctieprofielIntro />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/functieprofiel-vragen"
                element={
                  <ProtectedRoute>
                    <FunctieprofielVragen />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/functieprofiel-download"
                element={
                  <ProtectedRoute>
                    <FunctieprofielDownload />
                  </ProtectedRoute>
                }
              />
              
              {/* Legacy redirects */}
              <Route path="/zoekprofiel-intro" element={<Navigate to="/functieprofiel-intro" replace />} />
              <Route path="/zoekprofiel-vragen" element={<Navigate to="/functieprofiel-vragen" replace />} />
              <Route path="/zoekprofiel-download" element={<Navigate to="/functieprofiel-download" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useLayoutEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";
import PaymentRequired from "./pages/PaymentRequired";
import OverVinster from "./pages/OverVinster";
import VoorWieIsHet from "./pages/VoorWieIsHet";
import VeelgesteldeVragen from "./pages/VeelgesteldeVragen";
import Contact from "./pages/Contact";
import PrivacyVerklaring from "./pages/PrivacyVerklaring";
import AlgemeneVoorwaarden from "./pages/AlgemeneVoorwaarden";
import RapportReview from "./pages/RapportReview";
import RapportDownload from "./pages/RapportDownload";
import OnderzoeksplanPagina from "./pages/OnderzoeksplanPagina";
import ZoekprofielIntro from "./pages/ZoekprofielIntro";
import ZoekprofielVragen from "./pages/ZoekprofielVragen";
import ZoekprofielDownload from "./pages/ZoekprofielDownload";
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

const queryClient = new QueryClient();

const App = () => {
  // Improved global title manager - ensures all pages show "Vinster" as title
  useLayoutEffect(() => {
    // Set title immediately before any rendering
    document.title = "Vinster";
  }, []);

  useEffect(() => {
    // Set title again after component mount
    document.title = "Vinster";
    
    // Create a more robust mutation observer to watch for title changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          if (document.title !== "Vinster") {
            console.log('Title changed to:', document.title, 'reverting to Vinster');
            document.title = "Vinster";
          }
        }
      });
    });
    
    // Observe title element and entire head for changes
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Additional backup interval check every 500ms
    const titleInterval = setInterval(() => {
      if (document.title !== "Vinster") {
        console.log('Interval check: Title was', document.title, 'setting to Vinster');
        document.title = "Vinster";
      }
    }, 500);
    
    return () => {
      observer.disconnect();
      clearInterval(titleInterval);
    };
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
              <Route path="/over-vinster" element={<OverVinster />} />
              <Route path="/voor-wie-is-het" element={<VoorWieIsHet />} />
              <Route path="/veelgestelde-vragen" element={<VeelgesteldeVragen />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-verklaring" element={<PrivacyVerklaring />} />
              <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
              
              {/* Legacy redirect from old de-mens-achter-vinster to new over-vinster */}
              <Route path="/de-mens-achter-vinster" element={<Navigate to="/over-vinster" replace />} />
              
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
                path="/zoekprofiel-intro"
                element={
                  <ProtectedRoute>
                    <ZoekprofielIntro />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/zoekprofiel-vragen"
                element={
                  <ProtectedRoute>
                    <ZoekprofielVragen />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/zoekprofiel-download"
                element={
                  <ProtectedRoute>
                    <ZoekprofielDownload />
                  </ProtectedRoute>
                }
              />
              
              {/* Legacy redirects - from old functieprofiel to new zoekprofiel routes */}
              <Route path="/functieprofiel-intro" element={<Navigate to="/zoekprofiel-intro" replace />} />
              <Route path="/functieprofiel-vragen" element={<Navigate to="/zoekprofiel-vragen" replace />} />
              <Route path="/functieprofiel-download" element={<Navigate to="/zoekprofiel-download" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

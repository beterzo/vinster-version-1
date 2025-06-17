
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import LandingPage from "@/pages/LandingPage";
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import EnthousiasmeIntro from "@/pages/EnthousiasmeIntro";
import EnthousiasmeStep1 from "@/pages/EnthousiasmeStep1";
import EnthousiasmeStep2 from "@/pages/EnthousiasmeStep2";
import EnthousiasmeStep3 from "@/pages/EnthousiasmeStep3";
import EnthousiasmeStep4 from "@/pages/EnthousiasmeStep4";
import WensberoepenIntro from "@/pages/WensberoepenIntro";
import WensberoepenStep1 from "@/pages/WensberoepenStep1";
import WensberoepenStep2 from "@/pages/WensberoepenStep2";
import WensberoepenStep3 from "@/pages/WensberoepenStep3";
import WensberoepenVoltooiPagina from "@/pages/WensberoepenVoltooiPagina";
import ProfielVoltooienIntro from "@/pages/ProfielVoltooienIntro";
import PrioriteitenActiviteiten from "@/pages/PrioriteitenActiviteiten";
import PrioriteitenInteresses from "@/pages/PrioriteitenInteresses";
import PrioriteitenWerkomstandigheden from "@/pages/PrioriteitenWerkomstandigheden";
import ExtraInformatieVragen from "@/pages/ExtraInformatieVragen";
import RapportReview from "@/pages/RapportReview";
import RapportDownload from "@/pages/RapportDownload";
import OnderzoeksplanPagina from "@/pages/OnderzoeksplanPagina";
import ZoekprofielIntro from "@/pages/ZoekprofielIntro";
import ZoekprofielVragen from "@/pages/ZoekprofielVragen";
import ZoekprofielDownload from "@/pages/ZoekprofielDownload";
import PaymentRequired from "@/pages/PaymentRequired";
import NotFound from "@/pages/NotFound";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Toaster />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
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
                path="/enthousiasme-stap-1" 
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep1 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/enthousiasme-stap-2" 
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/enthousiasme-stap-3" 
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep3 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/enthousiasme-stap-4" 
                element={
                  <ProtectedRoute>
                    <EnthousiasmeStep4 />
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
                path="/wensberoepen-stap-1" 
                element={
                  <ProtectedRoute>
                    <WensberoepenStep1 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wensberoepen-stap-2" 
                element={
                  <ProtectedRoute>
                    <WensberoepenStep2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wensberoepen-stap-3" 
                element={
                  <ProtectedRoute>
                    <WensberoepenStep3 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wensberoepen-voltooid" 
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
                path="/extra-informatie-vragen" 
                element={
                  <ProtectedRoute>
                    <ExtraInformatieVragen />
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
              <Route path="/payment-required" element={<PaymentRequired />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

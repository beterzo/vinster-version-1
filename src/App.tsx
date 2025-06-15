
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PaymentRequired from "./pages/PaymentRequired";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentGuard from "./components/PaymentGuard";
import EnthousiasmeIntro from "./pages/EnthousiasmeIntro";
import EnthousiasmeStep1 from "./pages/EnthousiasmeStep1";
import EnthousiasmeStep2 from "./pages/EnthousiasmeStep2";
import EnthousiasmeStep3 from "./pages/EnthousiasmeStep3";
import EnthousiasmeStep4 from "./pages/EnthousiasmeStep4";
import WensberoepenIntro from "./pages/WensberoepenIntro";
import WensberoepenStep1 from "./pages/WensberoepenStep1";
import WensberoepenStep2 from "./pages/WensberoepenStep2";
import WensberoepenStep3 from "./pages/WensberoepenStep3";
import ProfielVoltooienIntro from "./pages/ProfielVoltooienIntro";
import ExtraInformatieVragen from "./pages/ExtraInformatieVragen";
import PrioriteitenActiviteiten from "./pages/PrioriteitenActiviteiten";
import PrioriteitenWerkomstandigheden from "./pages/PrioriteitenWerkomstandigheden";
import PrioriteitenInteresses from "./pages/PrioriteitenInteresses";
import RapportReview from "./pages/RapportReview";
import RapportDownload from "./pages/RapportDownload";

const queryClient = new QueryClient();

// Component to handle automatic redirects for authenticated users
const AuthRedirect = () => {
  const { user, session, loading } = useAuth();

  console.log('🔄 AuthRedirect check:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading 
  });

  if (loading) {
    console.log('🔄 AuthRedirect: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (user && session) {
    console.log('🔄 AuthRedirect: User authenticated, redirecting to payment check');
    return <Navigate to="/payment-required" replace />;
  }

  console.log('🔄 AuthRedirect: No auth, redirecting to login');
  return <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/landingspagina" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/payment-required" element={
              <ProtectedRoute>
                <PaymentRequired />
              </ProtectedRoute>
            } />
            <Route path="/home" element={
              <PaymentGuard>
                <Home />
              </PaymentGuard>
            } />
            <Route path="/enthousiasme-intro" element={
              <PaymentGuard>
                <EnthousiasmeIntro />
              </PaymentGuard>
            } />
            <Route path="/enthousiasme-stap-1" element={
              <PaymentGuard>
                <EnthousiasmeStep1 />
              </PaymentGuard>
            } />
            <Route path="/enthousiasme-stap-2" element={
              <PaymentGuard>
                <EnthousiasmeStep2 />
              </PaymentGuard>
            } />
            <Route path="/enthousiasme-stap-3" element={
              <PaymentGuard>
                <EnthousiasmeStep3 />
              </PaymentGuard>
            } />
            <Route path="/enthousiasme-stap-4" element={
              <PaymentGuard>
                <EnthousiasmeStep4 />
              </PaymentGuard>
            } />
            <Route path="/wensberoepen-intro" element={
              <PaymentGuard>
                <WensberoepenIntro />
              </PaymentGuard>
            } />
            <Route path="/wensberoepen-stap-1" element={
              <PaymentGuard>
                <WensberoepenStep1 />
              </PaymentGuard>
            } />
            <Route path="/wensberoepen-stap-2" element={
              <PaymentGuard>
                <WensberoepenStep2 />
              </PaymentGuard>
            } />
            <Route path="/wensberoepen-stap-3" element={
              <PaymentGuard>
                <WensberoepenStep3 />
              </PaymentGuard>
            } />
            <Route path="/profiel-voltooien-intro" element={
              <PaymentGuard>
                <ProfielVoltooienIntro />
              </PaymentGuard>
            } />
            <Route path="/extra-informatie-vragen" element={
              <PaymentGuard>
                <ExtraInformatieVragen />
              </PaymentGuard>
            } />
            <Route path="/prioriteiten-activiteiten" element={
              <PaymentGuard>
                <PrioriteitenActiviteiten />
              </PaymentGuard>
            } />
            <Route path="/prioriteiten-werkomstandigheden" element={
              <PaymentGuard>
                <PrioriteitenWerkomstandigheden />
              </PaymentGuard>
            } />
            <Route path="/prioriteiten-interesses" element={
              <PaymentGuard>
                <PrioriteitenInteresses />
              </PaymentGuard>
            } />
            <Route path="/rapport-review" element={
              <PaymentGuard>
                <RapportReview />
              </PaymentGuard>
            } />
            <Route path="/rapport-download" element={
              <PaymentGuard>
                <RapportDownload />
              </PaymentGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

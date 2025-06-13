
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
import ProtectedRoute from "./components/ProtectedRoute";
import EnthousiasmeIntro from "./pages/EnthousiasmeIntro";
import EnthousiasmeStep1 from "./pages/EnthousiasmeStep1";
import EnthousiasmeStep2 from "./pages/EnthousiasmeStep2";
import EnthousiasmeStep3 from "./pages/EnthousiasmeStep3";
import EnthousiasmeStep4 from "./pages/EnthousiasmeStep4";
import WensberoepenIntro from "./pages/WensberoepenIntro";
import WensberoepenStep1 from "./pages/WensberoepenStep1";
import WensberoepenStep2 from "./pages/WensberoepenStep2";
import WensberoepenStep3 from "./pages/WensberoepenStep3";

const queryClient = new QueryClient();

// Component to handle automatic redirects for authenticated users
const AuthRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

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
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/enthousiasme-intro" element={
              <ProtectedRoute>
                <EnthousiasmeIntro />
              </ProtectedRoute>
            } />
            <Route path="/enthousiasme-stap-1" element={
              <ProtectedRoute>
                <EnthousiasmeStep1 />
              </ProtectedRoute>
            } />
            <Route path="/enthousiasme-stap-2" element={
              <ProtectedRoute>
                <EnthousiasmeStep2 />
              </ProtectedRoute>
            } />
            <Route path="/enthousiasme-stap-3" element={
              <ProtectedRoute>
                <EnthousiasmeStep3 />
              </ProtectedRoute>
            } />
            <Route path="/enthousiasme-stap-4" element={
              <ProtectedRoute>
                <EnthousiasmeStep4 />
              </ProtectedRoute>
            } />
            <Route path="/wensberoepen-intro" element={
              <ProtectedRoute>
                <WensberoepenIntro />
              </ProtectedRoute>
            } />
            <Route path="/wensberoepen-stap-1" element={
              <ProtectedRoute>
                <WensberoepenStep1 />
              </ProtectedRoute>
            } />
            <Route path="/wensberoepen-stap-2" element={
              <ProtectedRoute>
                <WensberoepenStep2 />
              </ProtectedRoute>
            } />
            <Route path="/wensberoepen-stap-3" element={
              <ProtectedRoute>
                <WensberoepenStep3 />
              </ProtectedRoute>
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


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/landingspagina" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/enthousiasme-intro" element={<EnthousiasmeIntro />} />
          <Route path="/enthousiasme-stap-1" element={<EnthousiasmeStep1 />} />
          <Route path="/enthousiasme-stap-2" element={<EnthousiasmeStep2 />} />
          <Route path="/enthousiasme-stap-3" element={<EnthousiasmeStep3 />} />
          <Route path="/enthousiasme-stap-4" element={<EnthousiasmeStep4 />} />
          <Route path="/wensberoepen-intro" element={<WensberoepenIntro />} />
          <Route path="/wensberoepen-stap-1" element={<WensberoepenStep1 />} />
          <Route path="/wensberoepen-stap-2" element={<WensberoepenStep2 />} />
          <Route path="/wensberoepen-stap-3" element={<WensberoepenStep3 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

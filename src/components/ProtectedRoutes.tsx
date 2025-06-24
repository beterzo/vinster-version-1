
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import PaymentRequired from "@/pages/PaymentRequired";
import RapportReview from "@/pages/RapportReview";
import RapportDownload from "@/pages/RapportDownload";
import OnderzoeksplanPagina from "@/pages/OnderzoeksplanPagina";
import ZoekprofielIntro from "@/pages/ZoekprofielIntro";
import ZoekprofielVragen from "@/pages/ZoekprofielVragen";
import ZoekprofielDownload from "@/pages/ZoekprofielDownload";
import EnthousiasmeIntro from "@/pages/EnthousiasmeIntro";
import EnthousiasmeStep1 from "@/pages/EnthousiasmeStep1";
import EnthousiasmeStep2 from "@/pages/EnthousiasmeStep2";
import EnthousiasmeStep3 from "@/pages/EnthousiasmeStep3";
import WensberoepenIntro from "@/pages/WensberoepenIntro";
import WensberoepenStep1 from "@/pages/WensberoepenStep1";
import WensberoepenStep2 from "@/pages/WensberoepenStep2";
import WensberoepenStep3 from "@/pages/WensberoepenStep3";
import WensberoepenVoltooiPagina from "@/pages/WensberoepenVoltooiPagina";
import ProfielVoltooienIntro from "@/pages/ProfielVoltooienIntro";
import ExtraInformatieVragen from "@/pages/ExtraInformatieVragen";
import PrioriteitenActiviteiten from "@/pages/PrioriteitenActiviteiten";
import PrioriteitenInteresses from "@/pages/PrioriteitenInteresses";
import PrioriteitenWerkomstandigheden from "@/pages/PrioriteitenWerkomstandigheden";

const ProtectedRoutes = () => {
  return (
    <>
      <Route 
        path="/payment-required" 
        element={
          <ProtectedRoute requirePayment={false}>
            <PaymentRequired />
          </ProtectedRoute>
        } 
      />
      
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
    </>
  );
};

export default ProtectedRoutes;

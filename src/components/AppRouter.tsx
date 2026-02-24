import { Routes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { useStepAccess } from "@/hooks/useStepAccess";
import ConditionalRoute from "@/components/ConditionalRoute";
import React from "react";

// Public route imports
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import CheckEmailPasswordResetPage from "@/pages/CheckEmailPasswordResetPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import PasswordResetSuccessPage from "@/pages/PasswordResetSuccessPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import EmailConfirmedPage from "@/pages/EmailConfirmedPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import DebugPasswordReset from "@/pages/DebugPasswordReset";
import OverVinster from "@/pages/OverVinster";
import VoorWieIsHet from "@/pages/VoorWieIsHet";
import VeelgesteldeVragen from "@/pages/VeelgesteldeVragen";
import Ervaringen from "@/pages/Ervaringen";
import Contact from "@/pages/Contact";
import PrivacyVerklaring from "@/pages/PrivacyVerklaring";
import AlgemeneVoorwaarden from "@/pages/AlgemeneVoorwaarden";
import Cookiebeleid from "@/pages/Cookiebeleid";
import ToegangscodesProfessionals from "@/pages/ToegangscodesProfessionals";
import TrajectOpnieuwStartenUitleg from "@/pages/TrajectOpnieuwStartenUitleg";
import VoorbeeldrapportGenerator from "@/pages/VoorbeeldrapportGenerator";
import PaymentSuccess from "@/pages/PaymentSuccess";
import ProfessionalCodesSuccess from "@/pages/ProfessionalCodesSuccess";
import OrganisatiesOverzicht from "@/pages/OrganisatiesOverzicht";
import OrganisatieLanding from "@/pages/OrganisatieLanding";

// Protected route imports
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import PaymentRequired from "@/pages/PaymentRequired";
import RapportDownload from "@/pages/RapportDownload";
import OnderzoeksplanPagina from "@/pages/OnderzoeksplanPagina";
import ZoekprofielIntro from "@/pages/ZoekprofielIntro";
import ZoekprofielAntwoorden from "@/pages/ZoekprofielAntwoorden";
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
import RapportGenererenConfirmatie from "@/pages/RapportGenererenConfirmatie";
import RapportBekijken from "@/pages/RapportBekijken";
import RondeDashboard from "@/pages/RondeDashboard";
import { Navigate } from "react-router-dom";

const ConditionalRouteWithAccess = ({ 
  stepId, 
  children 
}: { 
  stepId: string; 
  children: React.ReactNode;
}) => {
  const stepAccess = useStepAccess();
  const step = stepAccess[stepId as keyof typeof stepAccess];
  
  if (typeof step === 'object' && 'canAccess' in step && 'canEdit' in step) {
    return (
      <ConditionalRoute
        canAccess={step.canAccess}
        canEdit={step.canEdit}
        isLoading={stepAccess.isLoading}
        blockedReason={step.blockedReason}
      >
        {children}
      </ConditionalRoute>
    );
  }
  
  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/check-email-password-reset" element={<CheckEmailPasswordResetPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
      <Route path="/email-verification" element={<EmailVerificationPage />} />
      <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/debug-password-reset" element={<DebugPasswordReset />} />
      
      {/* Dutch Routes */}
      <Route path="/over-vinster" element={<OverVinster />} />
      <Route path="/voor-wie-is-het" element={<VoorWieIsHet />} />
      <Route path="/veelgestelde-vragen" element={<VeelgesteldeVragen />} />
      <Route path="/ervaringen" element={<Ervaringen />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-verklaring" element={<PrivacyVerklaring />} />
      <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
      <Route path="/cookiebeleid" element={<Cookiebeleid />} />
      <Route path="/toegangscodes-professionals" element={<ToegangscodesProfessionals />} />
      
      {/* English Routes */}
      <Route path="/about-vinster" element={<OverVinster />} />
      <Route path="/who-is-it-for" element={<VoorWieIsHet />} />
      <Route path="/frequently-asked-questions" element={<VeelgesteldeVragen />} />
      <Route path="/experiences" element={<Ervaringen />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/access-codes-professionals" element={<ToegangscodesProfessionals />} />

      {/* German routes */}
      <Route path="/uber-vinster" element={<OverVinster />} />
      <Route path="/fur-wen-ist-es" element={<VoorWieIsHet />} />
      <Route path="/haufig-gestellte-fragen" element={<VeelgesteldeVragen />} />
      <Route path="/erfahrungen" element={<Ervaringen />} />
      <Route path="/kontakt" element={<Contact />} />
      <Route path="/zugangscodes-fachkrafte" element={<ToegangscodesProfessionals />} />

      {/* Norwegian routes */}
      <Route path="/om-vinster" element={<OverVinster />} />
      <Route path="/hvem-er-det-for" element={<VoorWieIsHet />} />
      <Route path="/ofte-stilte-sporsmal" element={<VeelgesteldeVragen />} />
      <Route path="/erfaringer" element={<Ervaringen />} />
      <Route path="/kontakt" element={<Contact />} />
      <Route path="/tilgangskoder-fagfolk" element={<ToegangscodesProfessionals />} />
      
      {/* Professional codes success */}
      <Route path="/professional-codes-success" element={<ProfessionalCodesSuccess />} />

      {/* Voorbeeldrapport page */}
      <Route path="/voorbeeldrapport" element={<VoorbeeldrapportGenerator />} />

      {/* Organisaties routes */}
      <Route path="/organisaties" element={<OrganisatiesOverzicht />} />
      <Route path="/organisaties/:slug" element={<OrganisatieLanding />} />
      
      {/* Legacy redirect from old de-mens-achter-vinster to new over-vinster */}
      <Route path="/de-mens-achter-vinster" element={<Navigate to="/over-vinster" replace />} />

      {/* Protected Routes */}
      <Route 
        path="/payment-success" 
        element={
          <ProtectedRoute requirePayment={false}>
            <PaymentSuccess />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment-required" 
        element={
          <ProtectedRoute requirePayment={false}>
            <PaymentRequired />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rapport-genereren-confirmatie"
        element={
          <ProtectedRoute>
            <RapportGenererenConfirmatie />
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
        path="/rapport-bekijken/:roundId"
        element={
          <ProtectedRoute>
            <RapportBekijken />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ronde/:roundId"
        element={
          <ProtectedRoute>
            <RondeDashboard />
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
        path="/zoekprofiel-antwoorden"
        element={
          <ProtectedRoute>
            <ZoekprofielAntwoorden />
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
      
      <Route
        path="/traject-opnieuw-starten"
        element={
          <ProtectedRoute>
            <TrajectOpnieuwStartenUitleg />
          </ProtectedRoute>
        }
      />
      
      {/* Legacy redirects - from old routes to new zoekprofiel routes */}
      <Route path="/functieprofiel-intro" element={<Navigate to="/zoekprofiel-intro" replace />} />
      <Route path="/functieprofiel-vragen" element={<Navigate to="/zoekprofiel-antwoorden" replace />} />
      <Route path="/functieprofiel-download" element={<Navigate to="/zoekprofiel-download" replace />} />
      <Route path="/zoekprofiel-vragen" element={<Navigate to="/zoekprofiel-antwoorden" replace />} />

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

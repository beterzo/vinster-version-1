
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import EmailConfirmedPage from "@/pages/EmailConfirmedPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import OverVinster from "@/pages/OverVinster";
import VoorWieIsHet from "@/pages/VoorWieIsHet";
import VeelgesteldeVragen from "@/pages/VeelgesteldeVragen";
import Ervaringen from "@/pages/Ervaringen";
import Contact from "@/pages/Contact";
import PrivacyVerklaring from "@/pages/PrivacyVerklaring";
import AlgemeneVoorwaarden from "@/pages/AlgemeneVoorwaarden";

const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/email-verification" element={<EmailVerificationPage />} />
      <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/over-vinster" element={<OverVinster />} />
      <Route path="/voor-wie-is-het" element={<VoorWieIsHet />} />
      <Route path="/veelgestelde-vragen" element={<VeelgesteldeVragen />} />
      <Route path="/ervaringen" element={<Ervaringen />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-verklaring" element={<PrivacyVerklaring />} />
      <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
      
      {/* Legacy redirect from old de-mens-achter-vinster to new over-vinster */}
      <Route path="/de-mens-achter-vinster" element={<Navigate to="/over-vinster" replace />} />
    </>
  );
};

export default PublicRoutes;

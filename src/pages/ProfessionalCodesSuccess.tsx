import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Footer from "@/components/Footer";

const ProfessionalCodesSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No session ID found");
      return;
    }

    const fulfill = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fulfill-professional-codes", {
          body: { session_id: sessionId },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        setStatus("success");
      } catch (err: any) {
        console.error("Fulfillment error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Something went wrong");
      }
    };

    fulfill();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <img
            alt="Vinster Logo"
            onClick={() => navigate("/")}
            src="/lovable-uploads/597d8366-bb5f-4218-8d55-ff225da64b7d.png"
            className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        {status === "loading" && (
          <div className="space-y-6">
            <Loader2 className="h-16 w-16 animate-spin text-vinster-blue mx-auto" />
            <h1 className="text-2xl font-semibold" style={{ color: "#232D4B" }}>
              {t("professionals.toasts.redirecting") || "Codes worden gegenereerd..."}
            </h1>
            <p className="text-gray-600">Even geduld, je codes worden aangemaakt en per e-mail verstuurd.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-semibold" style={{ color: "#232D4B" }}>
              Je codes zijn per e-mail verzonden!
            </h1>
            <p className="text-gray-600">
              Controleer je inbox voor een e-mail met al je toegangscodes. Je kunt deze codes direct delen met je cliënten.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-vinster-blue hover:bg-vinster-blue/90 text-white mt-4"
            >
              {t("professionals.back_to_home")}
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-semibold" style={{ color: "#232D4B" }}>
              Er is iets misgegaan
            </h1>
            <p className="text-gray-600">{errorMessage}</p>
            <p className="text-sm text-gray-500">
              Neem contact op via{" "}
              <a href="mailto:team@vinster.ai" className="text-blue-600 hover:underline">
                team@vinster.ai
              </a>
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="mt-4"
            >
              {t("professionals.back_to_home")}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfessionalCodesSuccess;

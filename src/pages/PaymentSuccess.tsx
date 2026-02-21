import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });

        if (error || !data?.success) {
          console.error("Payment verification failed:", error || data);
          setStatus("error");
          return;
        }

        setStatus("success");
        // Redirect to home after 3 seconds
        setTimeout(() => navigate("/home"), 3000);
      } catch (err) {
        console.error("Error verifying payment:", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <img
          alt="Vinster Logo"
          className="h-20 w-auto mx-auto mb-8"
          src="/lovable-uploads/vinster-logo-2.png"
        />

        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-vinster-blue animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-vinster-blue">
              {t('payment.success.verifying') || 'Betaling verifiëren...'}
            </h1>
            <p className="text-gray-600">
              {t('payment.success.verifying_desc') || 'Even geduld, we controleren je betaling.'}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-vinster-blue">
              {t('payment.success.title') || 'Betaling geslaagd!'}
            </h1>
            <p className="text-gray-600">
              {t('payment.success.description') || 'Je wordt automatisch doorgestuurd...'}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-vinster-blue">
              {t('payment.success.error_title') || 'Er ging iets mis'}
            </h1>
            <p className="text-gray-600">
              {t('payment.success.error_desc') || 'Neem contact op met support als het probleem aanhoudt.'}
            </p>
            <button
              onClick={() => navigate("/payment-required")}
              className="mt-4 text-vinster-blue underline"
            >
              {t('payment.success.try_again') || 'Probeer opnieuw'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

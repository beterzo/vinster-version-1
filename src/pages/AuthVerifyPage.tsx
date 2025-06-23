
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

const AuthVerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      try {
        console.log('🔐 Processing verification redirect...');
        
        // Get parameters from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const redirectTo = searchParams.get('redirect_to');
        
        console.log('📝 Verification params:', { token: !!token, type, redirectTo });
        
        if (!token || !type) {
          setStatus('error');
          setMessage('Ongeldige verificatie link. Ontbrekende parameters.');
          return;
        }
        
        // Redirect to Supabase auth verification
        const supabaseUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${token}&type=${type}&redirect_to=${redirectTo || window.location.origin + '/login'}`;
        
        console.log('🔄 Redirecting to Supabase verification:', supabaseUrl);
        
        // Redirect to Supabase
        window.location.href = supabaseUrl;
        
      } catch (error) {
        console.error('❌ Verification redirect error:', error);
        setStatus('error');
        setMessage('Er is een fout opgetreden bij het verwerken van de verificatie link.');
      }
    };

    handleVerification();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Account verifiëren...
              </h1>
              <p className="text-gray-600">
                Je wordt doorgestuurd voor verificatie...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Verificatie geslaagd!
              </h1>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Verificatie mislukt
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <button
                onClick={() => navigate('/email-verification')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Nieuwe verificatie email aanvragen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthVerifyPage;


import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Processing auth callback...');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          setStatus('error');
          setMessage('Er is een fout opgetreden bij het verifiëren van je account.');
          return;
        }

        if (data.session) {
          console.log('✅ Email verification successful:', data.session.user.email);
          setStatus('success');
          setMessage('Je account is succesvol geverifieerd! Je kunt nu inloggen.');
          
          // Redirect to login page after short delay
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          console.log('❌ No session found after callback');
          setStatus('error');
          setMessage('Verificatie link is verlopen of ongeldig.');
        }
      } catch (error) {
        console.error('❌ Auth callback exception:', error);
        setStatus('error');
        setMessage('Er is een onverwachte fout opgetreden.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Account verifiëren...
              </h1>
              <p className="text-gray-600">
                Even geduld terwijl we je account verifiëren.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Verificatie geslaagd!
              </h1>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                Je wordt automatisch doorgestuurd naar de inlogpagina...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
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

export default AuthCallbackPage;

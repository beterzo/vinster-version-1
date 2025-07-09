
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Set language from URL parameter if present
    const langParam = searchParams.get('lang');
    if (langParam === 'nl' || langParam === 'en') {
      setLanguage(langParam);
    }

    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Processing auth callback...');
        console.log('📝 Search params:', Object.fromEntries(searchParams.entries()));
        
        // Handle email verification
        console.log('📧 Processing email verification callback');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          
          if (error.message.includes('Email link is invalid or has expired')) {
            setStatus('error');
            setMessage(t('email_verification.not_received'));
            return;
          }
          
          setStatus('error');
          setMessage(t('login.unknown_error'));
          return;
        }

        if (data.session) {
          console.log('✅ Email verification successful');
          
          const wasJustVerified = data.session.user.email_confirmed_at && 
            new Date(data.session.user.email_confirmed_at).getTime() > (Date.now() - 30000);
          
          if (wasJustVerified) {
            setStatus('success');
            setMessage(t('email_confirmed.description'));
          } else {
            setStatus('success');
            setMessage(t('email_confirmed.description'));
          }
          
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          console.log('❌ No session found after callback');
          setStatus('error');
          setMessage(t('email_verification.not_received'));
        }
      } catch (error) {
        console.error('❌ Auth callback exception:', error);
        setStatus('error');
        setMessage(t('login.unknown_error'));
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, t, setLanguage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          {/* Header with Logo and Language Switcher */}
          <div className="flex items-center justify-between mb-6">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <LanguageSwitcher />
          </div>

          {status === 'loading' && (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                {t('common.loading')}
              </h1>
              <p className="text-gray-600">
                {t('common.please_wait')}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                {t('common.success')}
              </h1>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                {t('common.redirecting')}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                {t('common.error')}
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {t('email_verification.back_to_login')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

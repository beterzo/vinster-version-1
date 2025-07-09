
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, language: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setLanguage } = useLanguage();

  // Function to fetch user profile and set language (only if not manually selected)
  const fetchUserProfileAndSetLanguage = async (userId: string) => {
    try {
      // Check if user has manually selected a language
      const hasManualSelection = localStorage.getItem('vinster-language-manual-selection');
      if (hasManualSelection === 'true') {
        console.log('🌐 Skipping automatic language setting - user has manual selection');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('language')
        .eq('id', userId)
        .single();

      if (!error && profile?.language) {
        setLanguage(profile.language as 'nl' | 'en');
        console.log('🌐 Language set from profile:', profile.language);
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth state');

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email || 'no user');
        console.log('📧 Email verification status:', {
          emailConfirmed: session?.user?.email_confirmed_at,
          userCreated: session?.user?.created_at,
          lastSignIn: session?.user?.last_sign_in_at
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Set language from user profile when user logs in (only if no manual selection)
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            fetchUserProfileAndSetLanguage(session.user.id);
          }, 0);
        }

        // Log session details for debugging
        if (session) {
          console.log('✅ Session active:', {
            userId: session.user.id,
            email: session.user.email,
            emailConfirmed: session.user.email_confirmed_at,
            expiresAt: new Date(session.expires_at! * 1000).toLocaleString()
          });
        } else {
          console.log('❌ No active session');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🔐 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('🔐 Initial session check:', {
          hasSession: !!session,
          email: session?.user?.email,
          emailConfirmed: session?.user?.email_confirmed_at
        });
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set language from profile for existing session (only if no manual selection)
        if (session?.user) {
          await fetchUserProfileAndSetLanguage(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🔐 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [setLanguage]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, language: string) => {
    console.log('🔐 Attempting signup for:', email, 'with language:', language);
    
    try {
      // Use vinster.ai domain for redirect to new email confirmed page
      const redirectUrl = 'https://vinster.ai/email-confirmed';
      console.log('🔗 Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            language: language // Include selected language in user metadata
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
      } else {
        console.log('✅ Signup successful - verification email will be sent');
        console.log('📊 Signup result:', {
          user: data.user?.email,
          emailConfirmed: data.user?.email_confirmed_at,
          needsConfirmation: !data.user?.email_confirmed_at,
          language: language,
          redirectUrl: redirectUrl
        });
      }

      return { error };
    } catch (error) {
      console.error('❌ Signup exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting signin for:', email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Signin error:', error);
      } else {
        console.log('✅ Signin successful');
      }

      return { error };
    } catch (error) {
      console.error('❌ Signin exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('🔐 Attempting signout');
    
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Signout error:', error);
      } else {
        console.log('✅ Signout successful');
      }

      return { error };
    } catch (error) {
      console.error('❌ Signout exception:', error);
      return { error };
    }
  };

  const resendConfirmation = async (email: string) => {
    console.log('🔐 Resending confirmation email for:', email);
    
    try {
      // Use vinster.ai domain for redirect to new email confirmed page
      const redirectUrl = 'https://vinster.ai/email-confirmed';
      console.log('🔗 Using redirect URL for resend:', redirectUrl);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Resend confirmation error:', error);
      } else {
        console.log('✅ Confirmation email resent');
      }

      return { error };
    } catch (error) {
      console.error('❌ Resend confirmation exception:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔐 Resetting password for:', email);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://vinster.ai/reset-password',
      });

      if (error) {
        console.error('❌ Reset password error:', error);
      } else {
        console.log('✅ Password reset email sent');
      }

      return { error };
    } catch (error) {
      console.error('❌ Reset password exception:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    resetPassword,
  };

  console.log('🔐 AuthProvider render:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading,
    userEmail: user?.email,
    emailConfirmed: user?.email_confirmed_at
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

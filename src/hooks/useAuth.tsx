import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get the correct redirect URL
const getRedirectUrl = () => {
  // Check if we're in development and use the current origin
  // This will work both with localhost and Lovable preview URLs
  return `${window.location.origin}/login`;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth state');

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

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

        console.log('🔐 Initial session check:', session?.user?.email || 'no session');
        setSession(session);
        setUser(session?.user ?? null);
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
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('🔐 Attempting signup for:', email);
    const redirectUrl = getRedirectUrl();
    console.log('🔐 Using redirect URL:', redirectUrl);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
      } else {
        console.log('✅ Signup successful - confirmation email sent');
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
    const redirectUrl = getRedirectUrl();
    console.log('🔐 Using redirect URL for resend:', redirectUrl);
    
    try {
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

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
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

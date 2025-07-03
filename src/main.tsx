
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/hooks/useAuth'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CookieProvider } from '@/contexts/CookieContext'

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <CookieProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CookieProvider>
  </LanguageProvider>
);

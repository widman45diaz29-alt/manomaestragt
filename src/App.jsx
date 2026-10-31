import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import LoginDialog from './components/LoginDialog';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const path = location.hash;

  let page = <Home />;
  if (path === '#/admin') {
    page = <Admin />;
  } else if (path === '#/privacidad') {
    page = <Privacy />;
  }

  return (
    <AuthProvider>
      <SiteProvider>
        <>
          <Header onLogin={() => setLoginOpen(true)} />
          <main id="contenido">{page}</main>
          <Footer />
          <WhatsAppButton />
          <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
      </SiteProvider>
    </AuthProvider>
  );
}
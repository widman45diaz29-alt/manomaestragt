
import { AuthContext } from './auth-context';
import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import {
  auth,
  firebaseReady,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from '../lib/firebase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(firebaseReady);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firebaseReady) return undefined;

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setBusy(false);
    });
  }, []);

  const login = async (provider) => {
    setError('');

    if (!firebaseReady) {
      setError('El acceso social requiere configurar Firebase.');
      return;
    }

    try {
      setBusy(true);

      const authProvider =
        provider === 'facebook'
          ? new FacebookAuthProvider()
          : new GoogleAuthProvider();

      await signInWithPopup(auth, authProvider);
    } catch (e) {
      setError(
        e.code === 'auth/popup-closed-by-user'
          ? 'Se cerró la ventana antes de completar el acceso.'
          : 'No fue posible iniciar sesión. Revisa la configuración del proveedor.'
      );
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    if (auth) {
      return signOut(auth);
    }

    return Promise.resolve();
  };

  const admins = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    !!user?.email &&
    admins.includes(user.email.toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        user,
        busy,
        error,
        login,
        logout,
        isAdmin,
        firebaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

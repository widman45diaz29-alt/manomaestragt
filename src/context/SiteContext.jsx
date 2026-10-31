import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db, storage, firebaseReady } from '../lib/firebase';
import { defaultSiteConfig } from '../config/siteConfig';
import { defaultServices } from '../config/services';

export const SiteContext = createContext(null);

export const useSite = () => useContext(SiteContext);

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(defaultSiteConfig);
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(firebaseReady);

  useEffect(() => {
    let active = true;

    const loadSite = async () => {
      if (!firebaseReady) return;

      try {
        const snapshot = await getDoc(doc(db, 'site', 'public'));

        if (snapshot.exists() && active) {
          const data = snapshot.data();

          setConfig({
            ...defaultSiteConfig,
            ...data.config,
            colors: {
              ...defaultSiteConfig.colors,
              ...data.config?.colors,
            },
          });

          setServices(
            defaultServices.map((service) => ({
              ...service,
              ...(data.services || []).find(
                (savedService) => savedService.id === service.id
              ),
            }))
          );
        }
      } catch (error) {
        console.error('Error al cargar la configuración del sitio:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSite();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const colors = config.colors || defaultSiteConfig.colors;

    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--ivory', colors.background);
    root.style.setProperty('--text', colors.text);
  }, [config.colors]);

  const save = async (nextConfig, nextServices) => {
    if (!firebaseReady) {
      throw new Error('Firebase no está configurado.');
    }

    const serialServices = nextServices.map((service) => {
      const { icon: _icon, ...rest } = service;
      return rest;
    });

    await setDoc(doc(db, 'site', 'public'), {
      config: nextConfig,
      services: serialServices,
      updatedAt: new Date().toISOString(),
    });

    setConfig(nextConfig);
    setServices(nextServices);
  };

  const uploadImage = async (file, serviceId) => {
    if (!storage) {
      throw new Error('Storage no configurado.');
    }

    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      throw new Error('Usa una imagen de hasta 5 MB.');
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');

    const target = ref(
      storage,
      `site/services/${serviceId}-${Date.now()}-${safeName}`
    );

    await uploadBytes(target, file, {
      contentType: file.type,
    });

    return getDownloadURL(target);
  };

  const value = useMemo(
    () => ({
      config,
      services,
      loading,
      save,
      uploadImage,
    }),
    [config, services, loading]
  );

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
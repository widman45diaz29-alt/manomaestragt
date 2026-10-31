
import { useState } from 'react';
import { Save, ShieldAlert } from 'lucide-react';

import { useAuth } from '../context/auth-context';
import { useSite } from '../context/site-context';

function AdminEditor({ config, services, save, uploadImage }) {
  const [c, setC] = useState(config);
  const [s, setS] = useState(services);
  const [msg, setMsg] = useState('');

  const field = (key, label, type = 'text') => (
    <label>
      {label}
      <input
        type={type}
        value={c[key] || ''}
        onChange={(e) =>
          setC((previous) => ({
            ...previous,
            [key]: e.target.value,
          }))
        }
      />
    </label>
  );

  const imageUpload = async (file, index) => {
    setMsg('Subiendo imagen...');

    try {
      const url = await uploadImage(file, s[index].id);

      setS((previous) =>
        previous.map((service, i) =>
          i === index ? { ...service, image: url } : service
        )
      );

      setMsg('Imagen cargada. Presiona Guardar y publicar.');
    } catch (error) {
      setMsg(error.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg('Guardando...');

    try {
      await save(c, s);
      setMsg('Cambios publicados correctamente.');
    } catch (error) {
      console.error('Error al guardar:', error);
      setMsg('No se pudieron guardar los cambios. Revisa los permisos de Firestore.');
    }
  };

  return (
    <section className="section container admin">
      <p className="eyebrow">Panel administrativo</p>

      <h1>Contenido y apariencia</h1>

      <p>
        Edita datos públicos sin tocar el código.
        Los cambios se guardan en Firestore.
      </p>

      <form onSubmit={submit} className="admin-form">
        <div className="admin-grid">
          {field('businessName', 'Nombre comercial')}
          {field('shortName', 'Nombre corto')}
          {field('tagline', 'Título principal')}
          {field('phoneDisplay', 'Teléfono visible')}
          {field('phoneE164', 'Teléfono internacional')}
          {field('whatsappE164', 'WhatsApp internacional')}
          {field('email', 'Correo')}
          {field('hours', 'Horarios')}
          {field('coverageSummary', 'Resumen de cobertura')}

          <label>
            Texto de nosotros
            <textarea
              rows="5"
              value={c.about || ''}
              onChange={(e) =>
                setC((previous) => ({
                  ...previous,
                  about: e.target.value,
                }))
              }
            />
          </label>
        </div>

        <h2>Colores</h2>

        <div className="color-grid">
          {Object.entries(c.colors || {}).map(([key, value]) => (
            <label key={key}>
              {key}

              <input
                type="color"
                value={value}
                onChange={(e) =>
                  setC((previous) => ({
                    ...previous,
                    colors: {
                      ...previous.colors,
                      [key]: e.target.value,
                    },
                  }))
                }
              />
            </label>
          ))}
        </div>

        <h2>Servicios</h2>

        <div className="admin-services">
          {s.map((service, index) => (
            <article key={service.id}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={service.enabled}
                  onChange={(e) =>
                    setS((previous) =>
                      previous.map((item, i) =>
                        i === index
                          ? { ...item, enabled: e.target.checked }
                          : item
                      )
                    )
                  }
                />
                Habilitado
              </label>

              <label>
                Nombre
                <input
                  value={service.name}
                  onChange={(e) =>
                    setS((previous) =>
                      previous.map((item, i) =>
                        i === index
                          ? { ...item, name: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={service.description}
                  onChange={(e) =>
                    setS((previous) =>
                      previous.map((item, i) =>
                        i === index
                          ? { ...item, description: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </label>

              <label>
                Ruta de imagen
                <input
                  value={service.image}
                  onChange={(e) =>
                    setS((previous) =>
                      previous.map((item, i) =>
                        i === index
                          ? { ...item, image: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </label>

              <label>
                Nueva imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      imageUpload(file, index);
                    }
                  }}
                />
              </label>
            </article>
          ))}
        </div>

        <button className="btn" type="submit">
          <Save size={18} />
          Guardar y publicar
        </button>

        {msg && <p role="status">{msg}</p>}
      </form>
    </section>
  );
}

export default function Admin() {
  const { user, isAdmin, firebaseReady } = useAuth();

  const {
    config,
    services,
    loading,
    save,
    uploadImage,
  } = useSite();

  if (!firebaseReady) {
    return (
      <section className="section container admin-empty">
        <ShieldAlert />

        <h1>Panel administrativo pendiente de configuración</h1>

        <p>
          Configura Firebase y VITE_ADMIN_EMAILS.
          No se ofrece un acceso falso o inseguro.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="section container">
        <p>Cargando configuración administrativa...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section container">
        <h1>Acceso requerido</h1>
        <p>Inicia sesión desde el encabezado.</p>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="section container">
        <h1>Acceso no autorizado</h1>
        <p>La cuenta actual no está en la lista de administradores.</p>
      </section>
    );
  }

  return (
    <AdminEditor
      config={config}
      services={services}
      save={save}
      uploadImage={uploadImage}
    />
  );
}

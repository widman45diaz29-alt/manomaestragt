
import { useState } from 'react';
import { Send, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const clean = (value) => value.replace(/[<>]/g, '').trim();

export default function ContactForm({
  selectedService,
  setSelectedService,
}) {
  const { config, services } = useSite();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: selectedService || '',
    zone: '',
    address: '',
    details: '',
    date: '',
    privacy: false,
  });

  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const currentService =
    selectedService !== undefined ? selectedService : form.service;

  const update = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (clean(form.name).length < 3) {
      validationErrors.name = 'Escribe tu nombre completo.';
    }

    if (!/^\+?[0-9\s-]{8,15}$/.test(form.phone)) {
      validationErrors.phone = 'Ingresa un teléfono válido.';
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      validationErrors.email = 'Revisa el correo electrónico.';
    }

    if (!currentService) {
      validationErrors.service = 'Selecciona un servicio.';
    }

    if (!clean(form.zone)) {
      validationErrors.zone = 'Indica tu zona o municipio.';
    }

    if (clean(form.details).length < 10) {
      validationErrors.details =
        'Describe el trabajo con al menos 10 caracteres.';
    }

    if (!form.privacy) {
      validationErrors.privacy =
        'Debes aceptar la política de privacidad.';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!config.whatsappE164) {
      setErrors({
        submit:
          'El número de WhatsApp aún no está configurado. Contacta a la empresa cuando publique un número.',
      });
      return;
    }

    setBusy(true);

    const service = services.find(
      (item) => item.id === currentService
    )?.name;

    const message = [
      config.whatsappMessage,
      `Nombre: ${clean(form.name)}`,
      `Teléfono: ${clean(form.phone)}`,
      `Correo: ${clean(form.email) || 'No proporcionado'}`,
      `Servicio: ${service || 'No especificado'}`,
      `Zona: ${clean(form.zone)}`,
      form.address && `Referencia: ${clean(form.address)}`,
      `Detalle: ${clean(form.details)}`,
      form.date && `Fecha preferida: ${form.date}`,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappNumber = config.whatsappE164.replace(/\D/g, '');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');

    setBusy(false);
  };

  const field = (name, label, required = false, type = 'text') => (
    <label>
      {label}
      {required && <span aria-hidden="true"> *</span>}

      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={update}
        aria-invalid={!!errors[name]}
      />

      {errors[name] && (
        <span className="error">{errors[name]}</span>
      )}
    </label>
  );

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      {field('name', 'Nombre completo', true)}

      {field('phone', 'Número de teléfono', true, 'tel')}

      {field('email', 'Correo electrónico (opcional)', false, 'email')}

      <label>
        Servicio solicitado *

        <select
          name="service"
          value={currentService}
          onChange={(e) => {
            update(e);
            setSelectedService?.(e.target.value);
          }}
          aria-invalid={!!errors.service}
        >
          <option value="">Selecciona una opción</option>

          {services
            .filter((service) => service.enabled)
            .map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
        </select>

        {errors.service && (
          <span className="error">{errors.service}</span>
        )}
      </label>

      {field('zone', 'Zona o municipio', true)}

      {field('address', 'Dirección o referencia (opcional)')}

      <label className="full">
        Describe el problema o trabajo *

        <textarea
          name="details"
          rows="5"
          value={form.details}
          onChange={update}
          aria-invalid={!!errors.details}
        />

        {errors.details && (
          <span className="error">{errors.details}</span>
        )}
      </label>

      {field('date', 'Fecha preferida (opcional)', false, 'date')}

      <label className="check full">
        <input
          name="privacy"
          type="checkbox"
          checked={form.privacy}
          onChange={update}
        />

        <span>
          Acepto la{' '}
          <a href="#/privacidad">política de privacidad</a>{' '}
          para preparar esta solicitud.
        </span>
      </label>

      {errors.privacy && (
        <span className="error full">{errors.privacy}</span>
      )}

      {errors.submit && (
        <p className="notice full" role="alert">
          {errors.submit}
        </p>
      )}

      <div className="form-actions full">
        <button className="btn" disabled={busy} type="submit">
          <Send size={18} />
          {busy ? 'Preparando...' : 'Continuar en WhatsApp'}
        </button>

        {config.phoneE164 && (
          <a className="btn btn-outline" href={`tel:${config.phoneE164}`}>
            <Phone size={18} />
            Llamar
          </a>
        )}
      </div>

      <p className="form-note full">
        No se guarda ni se envía información automáticamente.
        Revisarás el mensaje en WhatsApp y decidirás si lo envías.
      </p>
    </form>
  );
}

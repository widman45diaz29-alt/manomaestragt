
import { createElement } from 'react';
import SectionTitle from '../components/SectionTitle';
import {
  CalendarCheck,
  MessagesSquare,
  ClipboardList,
  ShieldCheck,
  Home,
  LayoutGrid
} from 'lucide-react';

const items = [
  [CalendarCheck, 'Atención organizada'],
  [MessagesSquare, 'Comunicación clara'],
  [ClipboardList, 'Cotización según el trabajo'],
  [ShieldCheck, 'Cuidado de la propiedad'],
  [Home, 'Coordinación de visitas'],
  [LayoutGrid, 'Variedad de servicios']
];

export default function Benefits() {
  return (
    <section className="section section-dark">
      <div className="container">
        <SectionTitle
          light
          eyebrow="Por qué elegirnos"
          title="Una experiencia clara, desde el primer contacto"
        >
          Propuestas sencillas y realistas para coordinar cada servicio.
        </SectionTitle>

        <div className="benefit-grid">
          {items.map(([Icon, title]) => (
            <div className="benefit" key={title}>
              {createElement(Icon)}
              <h3>{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import {Paintbrush, Wrench, Zap, Hammer, ClipboardCheck, Drill, PanelsTopLeft, PlusCircle} from 'lucide-react';
export const defaultServices=[
{id:'pintura',name:'Pintura y acabados',description:'Pintura interior y exterior, retoques, renovación de paredes y acabados.',icon:Paintbrush,image:'/assets/service-paint.webp',enabled:true},
{id:'plomeria',name:'Plomería',description:'Reparación de fugas, grifos, sanitarios, tuberías e instalaciones.',icon:Wrench,image:'/assets/service-plumbing.webp',enabled:true},
{id:'electricidad',name:'Electricidad',description:'Iluminación, interruptores, instalaciones y reparaciones por personal competente.',icon:Zap,image:'/assets/service-electric.webp',enabled:true},
{id:'reparaciones',name:'Reparaciones generales',description:'Puertas, cerraduras, muebles, accesorios y arreglos domésticos.',icon:Hammer,image:'/assets/service-repair.webp',enabled:true},
{id:'mantenimiento',name:'Mantenimiento preventivo',description:'Revisiones, mantenimiento periódico y prevención de problemas.',icon:ClipboardCheck,image:'/assets/service-maintenance.webp',enabled:true},
{id:'instalaciones',name:'Instalaciones',description:'Montaje e instalación de accesorios, muebles y elementos del hogar.',icon:Drill,image:'/assets/service-install.webp',enabled:true},
{id:'mejoras',name:'Mejoras y remodelaciones',description:'Pequeñas remodelaciones y mejoras según la complejidad del proyecto.',icon:PanelsTopLeft,image:'/assets/service-renovation.webp',enabled:true},
{id:'adicionales',name:'Servicios adicionales',description:'Categoría configurable para necesidades futuras o trabajos por evaluar.',icon:PlusCircle,image:'/assets/service-tools.webp',enabled:true}
];
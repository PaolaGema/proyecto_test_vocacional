// ============================================================
// Contenido de la landing (lan.png). Textos editables por marketing.
// ============================================================

/** Etapas del recorrido "Tu viaje". x/y/w en píxeles sobre la ilustración de 1440 × 760. */
export const JOURNEY_STOPS = [
  { order: 2, title: 'Test de personalidad', subtitle: 'Descubre quién eres', x: 526, y: 252, w: 280 },
  { order: 3, title: 'Test de Orientación Vocacional', subtitle: 'Explora lo que te gusta', x: 1017, y: 524, w: 250 },
  { order: 4, title: 'Meta', subtitle: 'Encuentra tu camino', x: 1332, y: 289, w: 290 },
  { order: 1, title: 'Punto de partida', subtitle: '', x: 200, y: 706, w: 240 },
]

export const BENEFITS = [
  'Descubre qué carrera va mejor contigo',
  'Conoce carreras nuevas e innovadoras',
  'Encuentra opciones que se ajustan a tu forma de ser y pensar',
  'Aclara tus dudas sobre tu futuro académico',
  'Recibe un informe sencillo con tus resultados',
  'Ten una guía que te ayude a tomar mejores decisiones',
]

/**
 * Testimonios de ejemplo (corregidas tildes y concordancia respecto al PNG).
 * Fotos: retratos de prueba de randomuser.me. TODO: reemplazar por fotos reales de
 * estudiantes con su autorización antes de publicar.
 */
export const TESTIMONIALS = [
  {
    name: 'Juan Pérez Gómez',
    role: 'Estudiante universitario',
    photo: '/images/landing/testimonios/juan.webp',
    quote: 'Gracias a este test descubrí que mi camino estaba en Diseño Gráfico. Hoy estudio lo que amo.',
  },
  {
    name: 'María Flores Alba',
    role: 'Estudiante universitaria',
    photo: '/images/landing/testimonios/maria.webp',
    quote: 'El informe de los resultados me dio claridad y pasos concretos. ¡Postulé a mi carrera!',
  },
  {
    name: 'Jorge Montesinos',
    role: 'Estudiante universitario',
    photo: '/images/landing/testimonios/jorge.webp',
    quote: 'Me ayudó a alinear mis intereses con carreras reales. Súper recomendado.',
  },
]

/**
 * Preguntas frecuentes. El PNG solo trae las preguntas.
 * TODO negocio: las respuestas son provisionales; confirmar sobre todo "¿Es gratis?".
 */
export const FAQS = [
  {
    q: '¿Cuánto dura el test?',
    a: 'Unos 35 minutos. Son 142 preguntas en 2 etapas: el test de personalidad y el test vocacional (3 bloques). Puedes pausar cuando quieras y continuar después desde la última pregunta.',
  },
  {
    q: '¿Es gratis?',
    a: 'Respuesta por confirmar con el equipo de Trabajito.',
  },
  {
    q: '¿Qué recibo al final?',
    a: 'Un informe con tu estilo personal, las áreas y carreras que mejor encajan contigo y los planes de estudio de esas carreras. Puedes descargarlo.',
  },
  {
    q: '¿Necesito crear cuenta?',
    a: 'Sí. La cuenta guarda tu progreso y tus resultados para que puedas volver a verlos cuando quieras.',
  },
]

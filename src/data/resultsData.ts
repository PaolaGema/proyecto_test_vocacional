// ============================================================
// DATOS MOCK de la pantalla de Resultados (Figma: "Test web").
// El back-end debe calcular estos valores a partir de las respuestas.
// ============================================================

export const MOCK_USER = { name: 'Juan Gómez' }

export type Trait = {
  name: string
  percent: number
  measures: string
  result: string
  suggestion: string
}

/** Pestaña 1 · Tu estilo personal (modelo Big Five) */
export const TRAITS: Trait[] = [
  {
    name: 'Sensibilidad emocional (N)',
    percent: 78,
    measures:
      'Tendencia a sentir emociones intensas y preocuparse con facilidad; sensibilidad al estrés y a los cambios.',
    result: 'Presenta emociones negativas con cierta frecuencia y reactividad moderada ante tensiones.',
    suggestion:
      'Ingenierías (análisis, programación), Artísticas (creación individual), Ambientales (laboratorio, campo)',
  },
  {
    name: 'Extraversión (E)',
    percent: 50,
    measures:
      'Nivel de energía y sociabilidad: gusto por estar con gente, hablar, participar y buscar actividades estimulantes.',
    result: 'Alterna momentos de sociabilidad y reserva, ajustando su energía a las circunstancias.',
    suggestion: 'Perfil equilibrado: puede adaptarse con facilidad.',
  },
  {
    name: 'Apertura (O)',
    percent: 14,
    measures:
      'Curiosidad y gusto por lo nuevo: imaginación, creatividad e interés por ideas, arte y experiencias distintas.',
    result: 'Prefiere rutinas y métodos conocidos, con menor interés por la novedad',
    suggestion: 'Salud (protocolos), Económicas (contabilidad/operación), Turísticas (operación).',
  },
  {
    name: 'Amabilidad (A)',
    percent: 55,
    measures:
      'Cooperación y empatía: disposición a confiar, ayudar y mantener relaciones respetuosas y armoniosas.',
    result: 'Trato cordial y justo, capaz de cooperar cuando es necesario.',
    suggestion: 'Perfil equilibrado: puede adaptarse con facilidad.',
  },
  {
    name: 'Responsabilidad (R)',
    percent: 2,
    measures: 'Organización y constancia: planificar, priorizar y cumplir tareas y metas manteniendo el orden.',
    result: 'Escasa estructura y disciplina, prefiere actuar de forma espontánea e improvisada.',
    // TODO contenido: el diseño traía "Falso" (texto de prueba). Sugerencia provisional a validar.
    suggestion: 'Carreras con rutinas flexibles y trabajo creativo: Artísticas, Turísticas (guía) y Sociales (campo).',
  },
]

export type AreaPreference = {
  area: string
  careers: string
  pref: number
  prefPersonality: number
  delta: number
  color: string
}

/** Pestaña 2 · Tus preferencias vocacionales (tabla + mapa) */
export const AREA_PREFERENCES: AreaPreference[] = [
  { area: 'Económicas', careers: 'Ciencias económicas, administrativas y de Negocios', pref: 58, prefPersonality: 24, delta: -34, color: '#1F6F8B' },
  { area: 'Artísticas', careers: 'Arquitectura, Diseño y Artes', pref: 24, prefPersonality: 5, delta: -19, color: '#F2994A' },
  { area: 'Ambientales', careers: 'Ciencias agropecuarias', pref: 2, prefPersonality: -7, delta: -9, color: '#1E6B3A' },
  { area: 'Turísticas', careers: 'Gastronomía, Turismo e idiomas', pref: -2, prefPersonality: -12, delta: -10, color: '#2D9CDB' },
  { area: 'Ingenierías', careers: 'Ingeniería, Industria y Construcción', pref: -12, prefPersonality: -21, delta: -9, color: '#9B3FA6' },
  { area: 'Salud', careers: 'Ciencias de la Salud', pref: -31, prefPersonality: -34, delta: -3, color: '#5BB531' },
  { area: 'Sociales', careers: 'Ciencias Sociales, Jurídicas y Humanas', pref: -49, prefPersonality: -43, delta: 6, color: '#0B2B3F' },
]

export type CareerScore = { name: string; percent: number }
export type AreaCareers = { area: string; careers: CareerScore[] }

/** Carreras dentro de las áreas que más se ajustan */
export const TOP_AREA_CAREERS: AreaCareers[] = [
  {
    area: 'Económicas',
    careers: [
      { name: 'Administración de empresas', percent: 80 },
      { name: 'Economía', percent: 24 },
      { name: 'Contaduría Pública/Auditoria', percent: 2 },
    ],
  },
  {
    area: 'Artísticas',
    careers: [
      { name: 'Arquitectura', percent: 100 },
      { name: 'Diseño gráfico', percent: 100 },
      { name: 'Comunicación Visual', percent: 100 },
      { name: 'Artes Plásticas', percent: 60 },
    ],
  },
]

export type StudyCareer = { name: string; compatibility: number; description: string }

/** Pestaña 3 · Tus planes de estudio */
export const STUDY_CAREERS: StudyCareer[] = [
  { name: 'Arquitectura', compatibility: 100, description: 'Transforma ideas en espacios innovadores que mejoran la vida de las personas, uniendo diseño, creatividad y técnica.' },
  { name: 'Diseño Gráfico', compatibility: 100, description: 'Comunica mensajes poderosos a través de imágenes y creatividad visual, combinando arte y tecnología.' },
  { name: 'Comunicación Visual', compatibility: 100, description: 'Diseña estrategias visuales que conectan a las personas con ideas, marcas y proyectos de forma clara y atractiva.' },
  { name: 'Administración de empresas', compatibility: 80, description: 'Lidera proyectos, gestiona recursos y toma decisiones estratégicas para impulsar el crecimiento de organizaciones.' },
  { name: 'Artes Plásticas', compatibility: 60, description: 'Expresa tu creatividad con técnicas y materiales artísticos para comunicar ideas únicas y originales.' },
  { name: 'Economía', compatibility: 24, description: 'Analiza mercados y recursos para comprender y proponer soluciones a los desafíos económicos de la sociedad.' },
]

export const UNIVERSITIES = [
  'Universidad Católica Boliviana',
  'Universidad Mayor de San Andrés',
  'Universidad Privada Boliviana',
]

const SAMPLE_SUBJECTS = [
  'Matemáticas I',
  'Geometría Descriptiva',
  'Composición Arquitectónica I',
  'Computación I',
  'Comunicación',
  'English Beginners',
]

/** Detalle del plan de estudios (mock: misma malla para cualquier carrera) */
export const STUDY_PLAN = {
  duration: '4 años',
  totalSubjects: '48 materias',
  modality: 'Presencial/Híbrida',
  semesters: ['1er semestre', '2do semestre', '3er semestre', '5to semestre', '6to semestre', '7mo semestre'].map(
    (name) => ({ name, subjects: SAMPLE_SUBJECTS }),
  ),
}

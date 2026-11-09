// ============================================================
// DATOS MOCK del Test de Orientación Vocacional.
// Contenido extraído del diseño de Figma (página "Test web").
// El equipo de back-end debe reemplazar estos datos por los de la API.
// ============================================================

export type ActivityOption = { text: string; image: string }
export type Block1Question = { a: ActivityOption; b: ActivityOption }
export type Block2Case = { situation: string; options: string[] }
export type Block3Area = { id: string; name: string; activities: string[] }

/** Escala de respuesta del test de personalidad */
export const LIKERT_OPTIONS = [
  "En total desacuerdo",
  "En desacuerdo",
  "Neutral",
  "De acuerdo",
  "Totalmente de acuerdo",
] as const

/** Test de personalidad: las 15 preguntas del diseño */
export const PERSONALITY_QUESTIONS: string[] = [
  "A menudo me siento inferior a los demás.",
  "Soy una persona alegre y animosa.",
  "A veces, cuando leo poesía o contemplo una obra de arte, siento una profunda emoción o excitación.",
  "Tiendo a pensar lo mejor de la gente.",
  "Parece que nunca soy capaz de organizarme.",
  "Rara vez me siento con miedo o ansioso.",
  "Disfruto mucho hablando con la gente.",
  "La poesía tiene poco o ningún efecto sobre mí.",
  "A veces intimido o adulo a la gente para que haga lo que yo quiero.",
  "Tengo unos objetivos claros y me esfuerzo por alcanzarlos de forma ordenada.",
  "A veces me vienen a la mente pensamientos aterradores.",
  "Disfruto en las fiestas en las que hay mucha gente.",
  "Tengo una gran variedad de intereses intelectuales.",
  "A veces consigo con artimañas que la gente haga lo que yo quiero.",
  "Trabajo mucho para conseguir mis metas."
]

/**
 * Estructura del diseño (Figma): 4 secciones de 15 preguntas, un corazón al terminar cada una.
 * Figma usa las mismas 15 preguntas en las 4 secciones; así se replica aquí.
 * TODO back-end: si el cuestionario real tiene preguntas distintas por sección, cargarlas aquí.
 */
export const PERSONALITY_SECTIONS = 4
export const PERSONALITY_ITEMS: string[] = Array.from(
  { length: PERSONALITY_SECTIONS * PERSONALITY_QUESTIONS.length },
  (_, i) => PERSONALITY_QUESTIONS[i % PERSONALITY_QUESTIONS.length],
)

/** Bloque 1 · Intereses profesionales: 60 pares A/B (4 secciones de 15 → 4 estrellas) */
export const BLOCK1_QUESTIONS: Block1Question[] = [
  {
    a: {
      text: "Diseñar robots para tareas de manufactura.",
      image: "/images/actividades/348196a2bb.webp"
    },
    b: {
      text: "Analizar datos de mercado para identificar tendencias de consumo",
      image: "/images/actividades/4ad0ae5716.webp"
    }
  },
  {
    a: {
      text: "Organizar proyectos comunitarios para mejorar la convivencia.",
      image: "/images/actividades/19a502bb34.webp"
    },
    b: {
      text: "Diseñar una ruta gastronómica por la ciudad.",
      image: "/images/actividades/e393099b7c.webp"
    }
  },
  {
    a: {
      text: "Desarrollar un protocolo de atención para pacientes con enfermedades crónicas.",
      image: "/images/actividades/c8f23f212e.webp"
    },
    b: {
      text: "Crear la iluminación artística de un espacio interior.",
      image: "/images/actividades/49b6bb1f32.webp"
    }
  },
  {
    a: {
      text: "Planificar cultivos sostenibles en una finca orgánica.",
      image: "/images/actividades/4e783c435b.webp"
    },
    b: {
      text: "Gestionar un festival de comida callejera.",
      image: "/images/actividades/c4b6093e0b.webp"
    }
  },
  {
    a: {
      text: "Programar una aplicación que automatice procesos empresariales.",
      image: "/images/actividades/9e4e8c10c6.webp"
    },
    b: {
      text: "Capacitar a personas en otro idioma.",
      image: "/images/actividades/a17af52344.webp"
    }
  },
  {
    a: {
      text: "Negociar con proveedores internacionales para obtener mejores condiciones.",
      image: "/images/actividades/6002f85347.webp"
    },
    b: {
      text: "Diseñar una identidad gráfica para una marca.",
      image: "/images/actividades/0b33320977.webp"
    }
  },
  {
    a: {
      text: "Asesorar a una persona que atraviesa un conflicto emocional.",
      image: "/images/actividades/bf229ce1f3.webp"
    },
    b: {
      text: "Realizar diagnósticos por imágenes en un hospital.",
      image: "/images/actividades/f89c062762.webp"
    }
  },
  {
    a: {
      text: "Crear un sistema de sensores IoT para monitorear maquinaria.",
      image: "/images/actividades/ceed1410e6.webp"
    },
    b: {
      text: "Implementar sistemas de riego eficiente para reducir consumo de agua.",
      image: "/images/actividades/ad2a163f63.webp"
    }
  },
  {
    a: {
      text: "Desarrollar campañas de marketing digital para lanzar un producto.",
      image: "/images/actividades/a1262cd288.webp"
    },
    b: {
      text: "Planificar campañas promocionales de turismo gastronómico.",
      image: "/images/actividades/e0a036713d.webp"
    }
  },
  {
    a: {
      text: "Elaborar maquetas tridimensionales de espacios urbanos.",
      image: "/images/actividades/fc95ca878b.webp"
    },
    b: {
      text: "Coordinar campañas de derechos humanos a nivel internacional.",
      image: "/images/actividades/143558f1a4.webp"
    }
  },
  {
    a: {
      text: "Aplicar técnicas de rehabilitación física a personas con lesiones.",
      image: "/images/actividades/fef60bc14f.webp"
    },
    b: {
      text: "Liderar un equipo de chefs durante un evento especial.",
      image: "/images/actividades/ede090a4e8.webp"
    }
  },
  {
    a: {
      text: "Elaborar planos estructurales para un puente urbano.",
      image: "/images/actividades/c777fb13cc.webp"
    },
    b: {
      text: "Administrar un portafolio de inversión.",
      image: "/images/actividades/57e8b6cd10.webp"
    }
  },
  {
    a: {
      text: "Manejar la salud de animales de granja.",
      image: "/images/actividades/6ef7b523bb.webp"
    },
    b: {
      text: "Diseñar experiencias de realidad virtual para presentar proyectos arquitectónicos.",
      image: "/images/actividades/cb3dafc159.webp"
    }
  },
  {
    a: {
      text: "Diseñar estrategias de mediación y negociación en entornos educativos.",
      image: "/images/actividades/53befe4151.webp"
    },
    b: {
      text: "Crear un programa de alimentación saludable para hoteles.",
      image: "/images/actividades/b770981a17.webp"
    }
  },
  {
    a: {
      text: "Organizar campañas de prevención oral en comunidades rurales.",
      image: "/images/actividades/df96408fec.webp"
    },
    b: {
      text: "Diseñar políticas de responsabilidad social corporativa.",
      image: "/images/actividades/d35d76f43b.webp"
    }
  },
  {
    a: {
      text: "Desarrollar algoritmos de inteligencia artificial para control industrial.",
      image: "/images/actividades/3834b507ef.webp"
    },
    b: {
      text: "Curar una exposición de arte contemporáneo.",
      image: "/images/actividades/f9f6649373.webp"
    }
  },
  {
    a: {
      text: "Desarrollar experiencias de degustación virtual para promocionar productos locales.",
      image: "/images/actividades/ef312f4468.webp"
    },
    b: {
      text: "Operar drones para monitorear cultivos y detectar plagas temprano.",
      image: "/images/actividades/36d7e20458.webp"
    }
  },
  {
    a: {
      text: "Planificar eventos culturales que promuevan la diversidad.",
      image: "/images/actividades/0303a07ff7.webp"
    },
    b: {
      text: "Gestionar la cadena logística de una empresa exportadora.",
      image: "/images/actividades/e871826105.webp"
    }
  },
  {
    a: {
      text: "Gestionar un servicio de nutrición para hospitales y escuelas.",
      image: "/images/actividades/e61aad8cd2.webp"
    },
    b: {
      text: "Diseñar mobiliario funcional y estéticamente atractivo.",
      image: "/images/actividades/f41af198c6.webp"
    }
  },
  {
    a: {
      text: "Supervisar la instalación de equipos en una planta de comunicaciones.",
      image: "/images/actividades/e58cbee44e.webp"
    },
    b: {
      text: "Diseñar un menú gourmet inspirado en ingredientes locales.",
      image: "/images/actividades/f49ede7693.webp"
    }
  },
  {
    a: {
      text: "Elaborar planes financieros para una startup agrícola.",
      image: "/images/actividades/e4f67e96dd.webp"
    },
    b: {
      text: "Certificar la producción de la finca como orgánica.",
      image: "/images/actividades/b73709e46d.webp"
    }
  },
  {
    a: {
      text: "Realizar estudios de opinión pública antes de elecciones.",
      image: "/images/actividades/08b4e82d9b.webp"
    },
    b: {
      text: "Crear la imagen gráfica de un festival cultural.",
      image: "/images/actividades/7a42e4a7cd.webp"
    }
  },
  {
    a: {
      text: "Desarrollar un programa de rehabilitación nutricional para deportistas.",
      image: "/images/actividades/f79c876f97.webp"
    },
    b: {
      text: "Gestionar un festival internacional para promover la cultura.",
      image: "/images/actividades/3a5c50473c.webp"
    }
  },
  {
    a: {
      text: "Modelar y simular procesos químicos a gran escala.",
      image: "/images/actividades/30cdc48862.webp"
    },
    b: {
      text: "Analizar la rentabilidad de nuevos mercados internacionales.",
      image: "/images/actividades/9ab2436639.webp"
    }
  },
  {
    a: {
      text: "Planificar campañas de reforestación y conservación de ecosistemas.",
      image: "/images/actividades/99f1e39357.webp"
    },
    b: {
      text: "Elaborar ilustraciones conceptuales para un videojuego.",
      image: "/images/actividades/cf1aefeb47.webp"
    }
  },
  {
    a: {
      text: "Coordinar programas de voluntariado para personas vulnerables.",
      image: "/images/actividades/fe708e06e4.webp"
    },
    b: {
      text: "Diseñar un programa de lenguas extranjeras para personas migrantes.",
      image: "/images/actividades/0412d7e495.webp"
    }
  },
  {
    a: {
      text: "Desarrollar sistemas de información farmacéutica.",
      image: "/images/actividades/4c4e7ffa35.webp"
    },
    b: {
      text: "Negociar alianzas estratégicas con aseguradoras para un hospital.",
      image: "/images/actividades/b336b381a0.webp"
    }
  },
  {
    a: {
      text: "Diseñar drones autónomos para inspección de infraestructuras.",
      image: "/images/actividades/2e41ddff7f.webp"
    },
    b: {
      text: "Diseñar una instalación artística interactiva en espacio público.",
      image: "/images/actividades/b60edb8c02.webp"
    }
  },
  {
    a: {
      text: "Crear un tour gastronómico que incluya visitas a granjas productoras.",
      image: "/images/actividades/fc32d807ae.webp"
    },
    b: {
      text: "Gestionar proyectos de producción agrícola sostenible.",
      image: "/images/actividades/90d4738735.webp"
    }
  },
  {
    a: {
      text: "Diseñar campañas de sensibilización sobre igualdad de género.",
      image: "/images/actividades/94b519c86d.webp"
    },
    b: {
      text: "Revisar balances contables para detectar áreas de mejora financiera.",
      image: "/images/actividades/83e8b2de15.webp"
    }
  },
  {
    a: {
      text: "Evaluar la eficacia de tratamientos en personas con problemas de movilidad.",
      image: "/images/actividades/ee13fc0edc.webp"
    },
    b: {
      text: "Diseñar un logotipo y manual de marca para una ONG.",
      image: "/images/actividades/e0a8807a3b.webp"
    }
  },
  {
    a: {
      text: "Configurar robots colaborativos en una línea de montaje.",
      image: "/images/actividades/8e70c842d5.webp"
    },
    b: {
      text: "Organizar una guía para promover lugares históricos.",
      image: "/images/actividades/baddd6ee98.webp"
    }
  },
  {
    a: {
      text: "Administrar exportaciones y aranceles de productos agroindustriales.",
      image: "/images/actividades/7ea6386b4c.webp"
    },
    b: {
      text: "Supervisar la elaboración de alimentos derivados de productos lácteos.",
      image: "/images/actividades/29e51eb0fa.webp"
    }
  },
  {
    a: {
      text: "Diseñar un plan de comunicación para promover patrimonio arquitectónico.",
      image: "/images/actividades/7e71fccbaa.webp"
    },
    b: {
      text: "Diseñar la escenografía de un espectáculo teatral.",
      image: "/images/actividades/4e0e85e4d3.webp"
    }
  },
  {
    a: {
      text: "Implementar protocolos de seguridad alimentaria en comedores escolares.",
      image: "/images/actividades/a6030cd28f.webp"
    },
    b: {
      text: "Aprender un nuevo idioma para poder comunicarme con hablantes nativos.",
      image: "/images/actividades/9c1c286654.webp"
    }
  },
  {
    a: {
      text: "Calibrar sensores de un sistema de control automático en planta.",
      image: "/images/actividades/f6887c6e7d.webp"
    },
    b: {
      text: "Desarrollar un plan de marketing para lanzar una fintech.",
      image: "/images/actividades/31a02e71bb.webp"
    }
  },
  {
    a: {
      text: "Desarrollar un huerto urbano educativo.",
      image: "/images/actividades/fe62d95067.webp"
    },
    b: {
      text: "Diseñar carteles ilustrados para la campaña del huerto.",
      image: "/images/actividades/5670f87a83.webp"
    }
  },
  {
    a: {
      text: "Mediar en conflictos comunitarios durante la organización de un debate político.",
      image: "/images/actividades/b48d60969b.webp"
    },
    b: {
      text: "Investigar cómo cambian las palabras y las estructuras gramaticales a lo largo del tiempo en diferentes lenguas.",
      image: "/images/actividades/eb38491b5d.webp"
    }
  },
  {
    a: {
      text: "Implementar un sistema de registro electrónico de medicamentos.",
      image: "/images/actividades/476106b5af.webp"
    },
    b: {
      text: "Analizar riesgos financieros para un fondo de inversión.",
      image: "/images/actividades/52df39b0e3.webp"
    }
  },
  {
    a: {
      text: "Desarrollar un software de simulación de estructuras.",
      image: "/images/actividades/b3740ff708.webp"
    },
    b: {
      text: "Diseñar la experiencia de usuario (UX) para una app cultural.",
      image: "/images/actividades/b6674a928f.webp"
    }
  },
  {
    a: {
      text: "Gestionar un programa de certificación de productos orgánicos para restaurantes.",
      image: "/images/actividades/14740b4e01.webp"
    },
    b: {
      text: "Planificar la rotación de cultivos para mejorar la fertilidad del suelo.",
      image: "/images/actividades/f26c0020a2.webp"
    }
  },
  {
    a: {
      text: "Organizar un foro nacional sobre políticas públicas.",
      image: "/images/actividades/0ec09d6075.webp"
    },
    b: {
      text: "Elaborar un estudio de viabilidad económica para un proyecto social.",
      image: "/images/actividades/ef7b5d8b21.webp"
    }
  },
  {
    a: {
      text: "Diseñar un programa de salud dental para niños.",
      image: "/images/actividades/99db9bed60.webp"
    },
    b: {
      text: "Crear un mural público que promueva el bienestar emocional.",
      image: "/images/actividades/06903daf54.webp"
    }
  },
  {
    a: {
      text: "Diseñar un sistema de energía solar para un hotel ecológico.",
      image: "/images/actividades/2eb0a8fc18.webp"
    },
    b: {
      text: "Trabajar como intérprete durante eventos internacionales donde se hablan varios idiomas.",
      image: "/images/actividades/a49615babe.webp"
    }
  },
  {
    a: {
      text: "Gestionar la cadena de suministro de productos frescos del campo al supermercado.",
      image: "/images/actividades/6772d690f0.webp"
    },
    b: {
      text: "Implementar prácticas de agricultura de precisión con GPS.",
      image: "/images/actividades/9a9e8563b1.webp"
    }
  },
  {
    a: {
      text: "Planificar una exposición itinerante sobre historia local.",
      image: "/images/actividades/37d784daa6.webp"
    },
    b: {
      text: "Diseñar el catálogo visual de una exposición.",
      image: "/images/actividades/f2d450a181.webp"
    }
  },
  {
    a: {
      text: "Crear directrices de higiene alimentaria para un evento masivo.",
      image: "/images/actividades/2489e8ad40.webp"
    },
    b: {
      text: "Enseñar mi lengua materna a personas extranjeras y crear materiales didácticos adaptados a su cultura.",
      image: "/images/actividades/9cb6b782ef.webp"
    }
  },
  {
    a: {
      text: "Optimizar algoritmos de comunicaciones para usar ondas de larga distancia.",
      image: "/images/actividades/6c98a8e6bc.webp"
    },
    b: {
      text: "Diseñar estrategias de pricing dinámico para e‑commerce.",
      image: "/images/actividades/06754e9953.webp"
    }
  },
  {
    a: {
      text: "Liderar un proyecto de reforestación con especies nativas.",
      image: "/images/actividades/41718ef89c.webp"
    },
    b: {
      text: "Diseñar señalética y gráficos informativos para el sendero ecológico.",
      image: "/images/actividades/8d85b7144c.webp"
    }
  },
  {
    a: {
      text: "Elaborar un manual de buenas prácticas para voluntarios.",
      image: "/images/actividades/0092c62831.webp"
    },
    b: {
      text: "Analizar subtítulos, doblajes o traducciones literarias para asegurar que transmitan con precisión el sentido original.",
      image: "/images/actividades/c9a5137713.webp"
    }
  },
  {
    a: {
      text: "Analizar muestras de suelo para detectar patógenos que afecten la salud humana.",
      image: "/images/actividades/f88411379e.webp"
    },
    b: {
      text: "Cultivar variedades resistentes al cambio climático.",
      image: "/images/actividades/b77c591872.webp"
    }
  },
  {
    a: {
      text: "Facilitar talleres de resolución de conflictos en escuelas.",
      image: "/images/actividades/701d799445.webp"
    },
    b: {
      text: "Diseñar un chatbot de atención ciudadana para trámites municipales.",
      image: "/images/actividades/f94c4bc55e.webp"
    }
  },
  {
    a: {
      text: "Establecer un protocolo de primeros auxilios para eventos deportivos.",
      image: "/images/actividades/cb63e21e90.webp"
    },
    b: {
      text: "Diseñar un logo y campaña visual para el evento.",
      image: "/images/actividades/14d177390d.webp"
    }
  },
  {
    a: {
      text: "Implementar un sistema de trazabilidad para productos agrícolas.",
      image: "/images/actividades/95d01c52ba.webp"
    },
    b: {
      text: "Evaluar algoritmos de machine learning para automatizar procesos.",
      image: "/images/actividades/9397d4491e.webp"
    }
  },
  {
    a: {
      text: "Crear una red de apoyo comunitario para adultos mayores.",
      image: "/images/actividades/60b5579811.webp"
    },
    b: {
      text: "Diseñar un programa de ejercicio adaptado para adultos mayores.",
      image: "/images/actividades/387ecd9c72.webp"
    }
  },
  {
    a: {
      text: "Programar un dron para fumigación selectiva.",
      image: "/images/actividades/b7825be720.webp"
    },
    b: {
      text: "Gestionar la operación diaria del dron y análisis de campo.",
      image: "/images/actividades/201ced262e.webp"
    }
  },
  {
    a: {
      text: "Coordinar grupos de apoyo en salud para adolescentes.",
      image: "/images/actividades/87354a0083.webp"
    },
    b: {
      text: "Organizar campañas de sensibilización en colegios.",
      image: "/images/actividades/4f52e3c169.webp"
    }
  },
  {
    a: {
      text: "Desarrollar un software de predicción meteorológica para agricultores.",
      image: "/images/actividades/8fd4b1eb2a.webp"
    },
    b: {
      text: "Planificar la siembra basándose en el pronóstico generado.",
      image: "/images/actividades/565913cf31.webp"
    }
  },
  {
    a: {
      text: "Implementar una línea telefónica de ayuda ciudadana.",
      image: "/images/actividades/020b0d6d86.webp"
    },
    b: {
      text: "Desarrollar protocolos para la atención de emergencias médicas vía remota.",
      image: "/images/actividades/41c2041b00.webp"
    }
  },
  {
    a: {
      text: "Diseñar máquinas, turbinas y mejoras para aviones.",
      image: "/images/actividades/237c35f78d.webp"
    },
    b: {
      text: "Supervisar la adopción de animales en la finca.",
      image: "/images/actividades/40f0eaf40d.webp"
    }
  }
]

/** Bloque 2 · Casos prácticos: ordenar 4 opciones (→ diamante) */
export const BLOCK2_CASES: Block2Case[] = [
  {
    situation: "Tu equipo detecta que la app que lanzarán en 2 semanas presenta fallos.",
    options: [
      "Reescribir rápidamente el módulo defectuoso tú mismo.",
      "Negociar con el cliente una extensión de plazo.",
      "Diseñar una campaña para mantener interesados a los usuarios.",
      "Revisar que la app cumpla con la reglamentación ambiental."
    ]
  },
  {
    situation: "Se te delega la organización de un evento cultural anual.",
    options: [
      "Gestionar patrocinios y presupuesto.",
      "Diseñar el layout de stands y zonas recreativas.",
      "Coordinar la programación de artistas y talleres.",
      "Crear un menú gourmet con productos locales para asistentes."
    ]
  },
  {
    situation: "En un hospital rural, aumentan pacientes con dolencias respiratorias.",
    options: [
      "Implementar un protocolo de clasificación rápida en emergencias.",
      "Analizar estadísticas para solicitar más presupuesto.",
      "Organizar talleres de prevención en comunidades cercanas.",
      "Evaluar si la contaminación agrícola del entorno es un factor."
    ]
  },
  {
    situation: "Granja inteligente: Se busca mejorar la productividad sostenible.",
    options: [
      "Instalar sensores IoT para monitorear humedad y nutrientes.",
      "Crear una marca premium para vender los productos.",
      "Capacitar al personal local en buenas prácticas agrícolas.",
      "Desarrollar rutas de agroturismo para visitantes."
    ]
  },
  {
    situation: "En un restaurante fusión, el chef principal renuncia una semana antes de la apertura.",
    options: [
      "Crear un menú nuevo que se adapte a las necesidades.",
      "Reconfigurar el diseño de la carta para un menú atractivo y sencillo.",
      "Crear una campaña en redes resaltando la historia del local.",
      "Diseñar un proceso de reclutamiento exprés entre cocineros."
    ]
  },
  {
    situation: "Un proyecto de vivienda social: El gobierno lanza un concurso de ideas.",
    options: [
      "Crear maquetas 3D que combinen estética y bajo costo.",
      "Calcular estructuras para optimizar materiales.",
      "Proponer cooperativas vecinales para autogestión del proyecto.",
      "Demostrar el impacto ambiental de la construcción en la zona."
    ]
  },
  {
    situation: "El parque nacional se plantea un plan de manejo ante incendios forestales.",
    options: [
      "Diseñar drones autónomos para detección temprana de focos.",
      "Estimar costos y gestionar fondos internacionales.",
      "Dirigir campañas educativas con escuelas.",
      "Crear itinerarios ecoturísticos que financien el proyecto."
    ]
  },
  {
    situation: "Una empresa tecnológica global quiere expandirse a un nuevo mercado latino.",
    options: [
      "Localizar la interfaz y adaptar UX al contexto cultural.",
      "Analizar la competencia y fijar precios de entrada.",
      "Diseñar una estrategia de relaciones públicas y RSE.",
      "Formar un equipo de cuidadores multilingüe para clientes."
    ]
  },
  {
    situation: "El Centro cultural municipal aprobó su remodelación completa.",
    options: [
      "Modelar el espacio en 3d con BIM para identificar materiales.",
      "Entrenar una red neuronal para identificar patrones a mejorar en la estructura.",
      "Crear una huerta urbana educativa en la azotea.",
      "Diseñar una campaña de crowdfunding para financiar el proyecto."
    ]
  },
  {
    situation: "Se detectan brotes de salmonella en la producción avícola.",
    options: [
      "Desarrollar un kit de diagnóstico rápido en granja.",
      "Lanzar una campaña educativa sobre manipulación segura de alimentos.",
      "Diseñar envases atractivos que indiquen certificación sanitaria.",
      "Evaluar la bioseguridad de los corrales y rediseñarla."
    ]
  },
  {
    situation: "Una startup agrícola busca innovaciones sostenibles.",
    options: [
      "Desarrollar drones para fumigación selectiva con IA.",
      "Diseñar cursos de emprendimiento para productores jóvenes.",
      "Crear branding visual para cada proyecto incubado.",
      "Organizar un festival gastronómico con productos piloto."
    ]
  },
  {
    situation: "La feria gastronómica regional necesita atraer turismo en temporada baja.",
    options: [
      "Crear paquetes turísticos con rutas culinarias y hospedaje.",
      "Negociar patrocinios con marcas locales de alimentos.",
      "Diseñar una app para reservas y recomendaciones del evento.",
      "Gestionar la logística de stands y cocinas móviles."
    ]
  },
  {
    situation: "Un hotel ecológico en la Amazonía pretende certificación internacional.",
    options: [
      "Implementar un sistema de energía solar y baterías.",
      "Capacitar al personal en prácticas turísticas responsables.",
      "Crear senderos interpretativos con señalética artística.",
      "Analizar la rentabilidad y mercado objetivo del proyecto."
    ]
  },
  {
    situation: "Una plataforma de tele‑salud busca llegar a zonas rurales sin cobertura médica.",
    options: [
      "Configurar antenas satelitales para ampliar señal.",
      "Impulsar talleres de uso de la plataforma a líderes comunitarios.",
      "Proponer alianzas con universidades de medicina para prácticas.",
      "Diseñar material didáctico interactivo para los pacientes."
    ]
  },
  {
    situation: "Programa de alimentación escolar: El Gobierno busca reducir malnutrición.",
    options: [
      "Diseñar menús equilibrados y culturalmente aceptables.",
      "Coordinar talleres de higiene alimentaria para familias.",
      "Implementar huertos escolares para auto‑abastecimiento.",
      "Establecer métricas de impacto socio‑económico del programa."
    ]
  }
]

/** Bloque 3 · Enfoque de interés: enumerar actividades por área (→ trofeo) */
export const BLOCK3_AREAS: Block3Area[] = [
  {
    id: "ingenieria",
    name: "Ingeniería",
    activities: [
      "Diseña, desarrolla y mantiene programas y plataformas digitales que resuelven problemas de información.",
      "Optimiza procesos productivos, humanos y logísticos para reducir costos y mejorar la eficiencia empresarial.",
      "Proyecta y construye infraestructuras como carreteras, puentes y edificios, garantizando seguridad y funcionalidad.",
      "Crea y controla circuitos, dispositivos y sistemas electrónicos que transforman y procesan señales eléctricas.",
      "Diseña, prueba y supervisa aeronaves y tecnologías asociadas para un vuelo seguro y eficiente.",
      "Concibe y perfecciona máquinas, mecanismos y sistemas térmicos que convierten energía en movimiento útil.",
      "Transforma materias primas en productos útiles mediante procesos físico-químicos controlados a escala industrial.",
      "Planifica y gestiona redes y tecnologías que permiten la transmisión de voz, datos y multimedia a distancia.",
      "Desarrolla algoritmos y sistemas capaces de aprender y tomar decisiones autónomas a partir de datos."
    ]
  },
  {
    id: "economicas",
    name: "Económicas",
    activities: [
      "Planifica, organiza y dirige recursos humanos, financieros y operativos para alcanzar objetivos organizacionales.",
      "Combina análisis de mercados, finanzas y procesos para maximizar la rentabilidad y competitividad de la empresa.",
      "Registra y verifica información financiera para garantizar precisión, transparencia y cumplimiento de normas.",
      "Modela y gestiona inversiones y riesgos diseñando soluciones cuantitativas para optimizar el valor económico.",
      "Coordina operaciones de compra-venta, logística y normativa entre países para expandir mercados y proveedores.",
      "Estudia cómo se producen, distribuyen y consumen bienes y servicios para explicar y predecir fenómenos económicos.",
      "Diseña estrategias de producto, precio, promoción y marca para atraer, persuadir y fidelizar clientes.",
      "Transforma datos corporativos en información accionable que respalda decisiones tácticas y estratégicas.",
      "Analiza grandes volúmenes de datos con estadística y aprendizaje automático para descubrir patrones y generar predicciones."
    ]
  },
  {
    id: "sociales",
    name: "Sociales",
    activities: [
      "Interpreta y aplica las leyes para defender derechos y resolver conflictos jurídicos.",
      "Estudia la mente y la conducta para evaluar, comprender y promover el bienestar psicológico.",
      "Interviene con individuos y comunidades para fortalecer recursos y superar problemas sociales.",
      "Diseña y gestiona mensajes en medios y organizaciones para informar, persuadir y construir reputación.",
      "Analiza sistemas de gobierno y políticas públicas para explicar y orientar la acción política.",
      "Planifica y facilita procesos de enseñanza-aprendizaje para desarrollar competencias y formar ciudadanos.",
      "Investiga la estructura y dinámica de la sociedad para entender patrones culturales, instituciones y cambio social."
    ]
  },
  {
    id: "salud",
    name: "Salud",
    activities: [
      "Diagnostica, trata y previene enfermedades para mantener y recuperar la salud de las personas.",
      "Cuida la salud bucal mediante prevención, diagnóstico y tratamiento de dientes y tejidos orales.",
      "Brinda atención integral, educación y apoyo al paciente para promover, mantener y restaurar su bienestar.",
      "Investiga y formula fármacos, analizando procesos químicos y biológicos para asegurar su eficacia y seguridad.",
      "Evalúa y rehabilita el movimiento corporal usando ejercicios y terapias físicas para recuperar funcionalidad."
    ]
  },
  {
    id: "arte",
    name: "Arte",
    activities: [
      "Concibe y proyecta espacios edificados que combinan funcionalidad, estética y viabilidad técnica.",
      "Crea soluciones visuales (logos, publicaciones, interfaces) que comunican mensajes de forma clara y atractiva.",
      "Produce obras visuales—pintura, escultura, grabado—para expresar ideas y emociones mediante formas y materiales.",
      "Organiza imagen, tipografía y medios digitales para transmitir información e identidad de manera impactante."
    ]
  },
  {
    id: "ambiental",
    name: "Ambiental",
    activities: [
      "Optimiza cultivos y suelos para lograr producción vegetal eficiente y sostenible.",
      "Evalúa y mitiga impactos, gestionando recursos y tecnologías para proteger ecosistemas.",
      "Diseña y mantiene maquinaria, riego e infraestructuras que soportan la producción agropecuaria."
      // En Figma (frame AMBIENTAL) la 4.ª tarjeta está vacía: confirmar con el equipo si falta una actividad
    ]
  },
  {
    id: "gastronomia",
    name: "Gastronomía",
    activities: [
      "Crea, prepara y presenta alimentos, fusionando técnica culinaria y gestión para ofrecer experiencias sensoriales de calidad.",
      "Organiza servicios de alojamiento, ocio y viajes para garantizar estancias agradables y promover destinos.",
      "Estudia la estructura y uso de las lenguas, aplicando ese conocimiento en enseñanza, traducción y comunicación intercultural."
    ]
  }
]

// ============================================================
// Opciones del formulario de registro (propuesta A).
// ============================================================

/** Grado: lista cerrada para que el dato llegue siempre igual al back-end. */
export const GRADES = [
  '1ro de secundaria',
  '2do de secundaria',
  '3ro de secundaria',
  '4to de secundaria',
  '5to de secundaria',
  '6to de secundaria',
  'Bachiller (ya egresé)',
]

/**
 * Unidades educativas para el buscador.
 * TODO back-end: reemplazar por la lista oficial (idealmente un endpoint de búsqueda
 * que devuelva id + nombre + ciudad). Estos nombres son solo de ejemplo.
 */
export const SCHOOLS = [
  { id: 'ue-001', name: 'U.E. Simón Bolívar', city: 'La Paz' },
  { id: 'ue-002', name: 'U.E. Juan XXIII', city: 'Cochabamba' },
  { id: 'ue-003', name: 'U.E. Santa Ana', city: 'Santa Cruz' },
  { id: 'ue-004', name: 'U.E. Antonio José de Sucre', city: 'Sucre' },
  { id: 'ue-005', name: 'U.E. San Francisco de Asís', city: 'Tarija' },
  { id: 'ue-006', name: 'U.E. Mariscal Andrés de Santa Cruz', city: 'La Paz' },
  { id: 'ue-007', name: 'U.E. Eduardo Abaroa', city: 'Oruro' },
  { id: 'ue-008', name: 'U.E. Germán Busch', city: 'Santa Cruz' },
  { id: 'ue-009', name: 'U.E. Bartolina Sisa', city: 'El Alto' },
  { id: 'ue-010', name: 'U.E. Pedro Domingo Murillo', city: 'La Paz' },
  { id: 'ue-011', name: 'U.E. Nuestra Señora del Carmen', city: 'Cochabamba' },
  { id: 'ue-012', name: 'U.E. Franz Tamayo', city: 'Potosí' },
]

/** Quita tildes y pasa a minúsculas para buscar sin importar cómo se escriba. */
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

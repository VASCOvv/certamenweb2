export const ESTADOS = ['Disponible', 'En uso', 'Mantención', 'Baja']

export const TIPOS = ['Notebook', 'PC', 'Monitor', 'Proyector', 'Impresora', 'Tablet']

const CLASES_ESTADO = {
  Disponible: 'estado-disponible',
  'En uso': 'estado-en-uso',
  Mantención: 'estado-mantencion',
  Baja: 'estado-baja',
}

export function claseEstado(estado) {
  return CLASES_ESTADO[estado] ?? ''
}

export function formatearFecha(fecha) {
  if (!fecha) return ''
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-')
  return `${dia}-${mes}-${anio}`
}
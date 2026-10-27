const API_URL = 'http://localhost:3000/equipos'

async function request(url, options = {}) {
  let response

  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const mensaje = data?.message ?? `Error ${response.status}`
    const detalles = Array.isArray(mensaje) ? mensaje : [mensaje]
    const error = new Error(detalles.join('. '))
    error.detalles = detalles
    error.status = response.status
    throw error
  }

  return data
}

export function listarEquipos() {
  return request(API_URL)
}

export function obtenerEquipo(id) {
  return request(`${API_URL}/${id}`)
}

export function crearEquipo(equipo) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(equipo),
  })
}

export function actualizarEquipo(id, equipo) {
  return request(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(equipo),
  })
}

export function eliminarEquipo(id) {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}
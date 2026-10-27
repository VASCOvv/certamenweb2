<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { eliminarEquipo, listarEquipos } from '../services/equiposApi.js'
import { ESTADOS, claseEstado } from '../utils/equipo.js'

const equipos = ref([])
const cargando = ref(false)
const error = ref('')
const mensaje = ref('')
const busqueda = ref('')
const filtroEstado = ref('')

const equiposFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()

  return equipos.value.filter((equipo) => {
    const coincideTexto =
      !texto ||
      [equipo.nombre, equipo.codigoInventario, equipo.tipo, equipo.ubicacion].some((campo) =>
        campo.toLowerCase().includes(texto),
      )
    const coincideEstado = !filtroEstado.value || equipo.estado === filtroEstado.value
    return coincideTexto && coincideEstado
  })
})

async function cargarEquipos() {
  cargando.value = true
  error.value = ''
  try {
    equipos.value = await listarEquipos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function eliminar(equipo) {
  const confirmado = confirm(
    `¿Seguro que deseas eliminar "${equipo.nombre}" (${equipo.codigoInventario})?`,
  )
  if (!confirmado) return

  error.value = ''
  mensaje.value = ''
  try {
    const respuesta = await eliminarEquipo(equipo.id)
    mensaje.value = respuesta.message
    await cargarEquipos()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(cargarEquipos)
</script>

<template>
  <section>
    <div class="encabezado">
      <h1>Equipos</h1>
      <RouterLink to="/equipos/nuevo" class="boton">+ Nuevo equipo</RouterLink>
    </div>

    <div class="filtros">
      <input
        v-model="busqueda"
        type="search"
        placeholder="Buscar por nombre, código, tipo o ubicación"
      />
      <select v-model="filtroEstado">
        <option value="">Todos los estados</option>
        <option v-for="estado in ESTADOS" :key="estado" :value="estado">{{ estado }}</option>
      </select>
    </div>

    <p v-if="mensaje" class="alerta exito">{{ mensaje }}</p>
    <p v-if="error" class="alerta error">{{ error }}</p>

    <p v-if="cargando" class="cargando">Cargando equipos...</p>

    <template v-else>
      <p v-if="!error && equipos.length === 0" class="vacio">No hay equipos registrados.</p>
      <p v-else-if="equipos.length > 0 && equiposFiltrados.length === 0" class="vacio">
        Ningún equipo coincide con la búsqueda.
      </p>

      <div v-if="equiposFiltrados.length > 0" class="tabla-contenedor">
        <table class="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="equipo in equiposFiltrados" :key="equipo.id">
              <td>{{ equipo.codigoInventario }}</td>
              <td>{{ equipo.nombre }}</td>
              <td>{{ equipo.tipo }}</td>
              <td>{{ equipo.ubicacion }}</td>
              <td>
                <span class="estado" :class="claseEstado(equipo.estado)">{{ equipo.estado }}</span>
              </td>
              <td>
                <div class="acciones">
                  <RouterLink :to="`/equipos/${equipo.id}`" class="boton chico secundario">
                    Ver
                  </RouterLink>
                  <RouterLink :to="`/equipos/${equipo.id}/editar`" class="boton chico secundario">
                    Editar
                  </RouterLink>
                  <button class="boton chico peligro" @click="eliminar(equipo)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="equipos.length > 0" class="total">
        Mostrando {{ equiposFiltrados.length }} de {{ equipos.length }} equipos
      </p>
    </template>
  </section>
</template>
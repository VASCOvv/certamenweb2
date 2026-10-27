<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { eliminarEquipo, obtenerEquipo } from '../services/equiposApi.js'
import { claseEstado, formatearFecha } from '../utils/equipo.js'

const route = useRoute()
const router = useRouter()

const equipo = ref(null)
const cargando = ref(false)
const error = ref('')

async function cargarEquipo() {
  cargando.value = true
  error.value = ''
  try {
    equipo.value = await obtenerEquipo(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function eliminar() {
  const confirmado = confirm(
    `¿Seguro que deseas eliminar "${equipo.value.nombre}" (${equipo.value.codigoInventario})?`,
  )
  if (!confirmado) return

  try {
    await eliminarEquipo(equipo.value.id)
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}

onMounted(cargarEquipo)
</script>

<template>
  <section>
    <RouterLink to="/" class="volver">← Volver al listado</RouterLink>

    <p v-if="route.query.guardado" class="alerta exito">Equipo guardado correctamente.</p>
    <p v-if="error" class="alerta error">{{ error }}</p>
    <p v-if="cargando" class="cargando">Cargando equipo...</p>

    <div v-if="equipo && !cargando" class="tarjeta">
      <div class="encabezado">
        <div>
          <p class="codigo">{{ equipo.codigoInventario }}</p>
          <h1>{{ equipo.nombre }}</h1>
        </div>
        <span class="estado" :class="claseEstado(equipo.estado)">{{ equipo.estado }}</span>
      </div>

      <dl class="detalle">
        <div>
          <dt>Tipo</dt>
          <dd>{{ equipo.tipo }}</dd>
        </div>
        <div>
          <dt>Marca</dt>
          <dd>{{ equipo.marca }}</dd>
        </div>
        <div>
          <dt>Modelo</dt>
          <dd>{{ equipo.modelo }}</dd>
        </div>
        <div>
          <dt>Ubicación</dt>
          <dd>{{ equipo.ubicacion }}</dd>
        </div>
        <div>
          <dt>Fecha de adquisición</dt>
          <dd>{{ formatearFecha(equipo.fechaAdquisicion) }}</dd>
        </div>
        <div class="completo">
          <dt>Observaciones</dt>
          <dd>{{ equipo.observaciones || 'Sin observaciones' }}</dd>
        </div>
      </dl>

      <div class="acciones">
        <RouterLink :to="`/equipos/${equipo.id}/editar`" class="boton">Editar</RouterLink>
        <button class="boton peligro" @click="eliminar">Eliminar</button>
      </div>
    </div>
  </section>
</template>
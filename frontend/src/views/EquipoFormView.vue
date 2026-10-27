<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { actualizarEquipo, crearEquipo, obtenerEquipo } from '../services/equiposApi.js'
import { ESTADOS, TIPOS } from '../utils/equipo.js'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const esEdicion = Boolean(id)

const form = reactive({
  codigoInventario: '',
  nombre: '',
  tipo: '',
  marca: '',
  modelo: '',
  ubicacion: '',
  estado: 'Disponible',
  fechaAdquisicion: '',
  observaciones: '',
})

const cargando = ref(false)
const guardando = ref(false)
const errores = ref([])

async function cargarEquipo() {
  cargando.value = true
  try {
    const equipo = await obtenerEquipo(id)
    Object.assign(form, {
      codigoInventario: equipo.codigoInventario,
      nombre: equipo.nombre,
      tipo: equipo.tipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      ubicacion: equipo.ubicacion,
      estado: equipo.estado,
      fechaAdquisicion: String(equipo.fechaAdquisicion).slice(0, 10),
      observaciones: equipo.observaciones ?? '',
    })
  } catch (e) {
    errores.value = e.detalles ?? [e.message]
  } finally {
    cargando.value = false
  }
}

async function guardar() {
  guardando.value = true
  errores.value = []

  const datos = {
    ...form,
    observaciones: form.observaciones.trim() || null,
  }

  try {
    const equipo = esEdicion ? await actualizarEquipo(id, datos) : await crearEquipo(datos)
    router.push({ path: `/equipos/${equipo.id}`, query: { guardado: '1' } })
  } catch (e) {
    errores.value = e.detalles ?? [e.message]
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  if (esEdicion) cargarEquipo()
})
</script>

<template>
  <section>
    <RouterLink to="/" class="volver">← Volver al listado</RouterLink>
    <h1>{{ esEdicion ? 'Editar equipo' : 'Nuevo equipo' }}</h1>

    <p v-if="cargando" class="cargando">Cargando equipo...</p>

    <form v-else class="tarjeta" novalidate @submit.prevent="guardar">
      <div v-if="errores.length" class="alerta error">
        <p>No se pudo guardar el equipo:</p>
        <ul>
          <li v-for="(mensaje, i) in errores" :key="i">{{ mensaje }}</li>
        </ul>
      </div>

      <div class="campos">
        <label>
          Código de inventario *
          <input v-model="form.codigoInventario" type="text" placeholder="Ej: INV-001" />
        </label>

        <label>
          Nombre *
          <input v-model="form.nombre" type="text" placeholder="Ej: Notebook Lenovo ThinkPad" />
        </label>

        <label>
          Tipo *
          <input v-model="form.tipo" type="text" list="tipos" placeholder="Ej: Notebook" />
          <datalist id="tipos">
            <option v-for="tipo in TIPOS" :key="tipo" :value="tipo" />
          </datalist>
        </label>

        <label>
          Marca *
          <input v-model="form.marca" type="text" placeholder="Ej: Lenovo" />
        </label>

        <label>
          Modelo *
          <input v-model="form.modelo" type="text" placeholder="Ej: ThinkPad E14" />
        </label>

        <label>
          Ubicación *
          <input v-model="form.ubicacion" type="text" placeholder="Ej: Laboratorio 1" />
        </label>

        <label>
          Estado *
          <select v-model="form.estado">
            <option v-for="estado in ESTADOS" :key="estado" :value="estado">{{ estado }}</option>
          </select>
        </label>

        <label>
          Fecha de adquisición *
          <input v-model="form.fechaAdquisicion" type="date" />
        </label>

        <label class="completo">
          Observaciones
          <textarea v-model="form.observaciones" rows="3" placeholder="Información adicional (opcional)"></textarea>
        </label>
      </div>

      <div class="acciones">
        <button type="submit" class="boton" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
        <RouterLink to="/" class="boton secundario">Cancelar</RouterLink>
      </div>
    </form>
  </section>
</template>
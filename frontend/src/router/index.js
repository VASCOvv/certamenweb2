import { createRouter, createWebHistory } from 'vue-router'
import EquiposListView from '../views/EquiposListView.vue'
import EquipoDetalleView from '../views/EquipoDetalleView.vue'
import EquipoFormView from '../views/EquipoFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'equipos', component: EquiposListView },
    { path: '/equipos/nuevo', name: 'equipo-nuevo', component: EquipoFormView },
    { path: '/equipos/:id', name: 'equipo-detalle', component: EquipoDetalleView },
    { path: '/equipos/:id/editar', name: 'equipo-editar', component: EquipoFormView },
  ],
})

export default router
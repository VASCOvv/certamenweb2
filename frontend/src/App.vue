<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="barra">
    <div class="contenedor barra-contenido">
      <RouterLink to="/" class="marca">Inventario Tecnológico</RouterLink>
      <nav>
        <RouterLink to="/">Equipos</RouterLink>
        <RouterLink to="/equipos/nuevo">Nuevo equipo</RouterLink>
      </nav>
    </div>
  </header>

  <main class="contenedor">
    <RouterView :key="$route.fullPath" />
  </main>
</template>
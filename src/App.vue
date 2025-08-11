<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar2.vue'

if (process.env.NODE_ENV === 'development') {
  console.log('¡Estás en modo de desarrollo!');
} else {
  console.log('¡Estás en modo de producción!');
}
</script>

<template>
  <div id="app" data-bs-theme="dark">
    
    <div class="container-fluid">
      <!-- Barra de navegación opcional -->
      <div id="content" class="d-flex">
        <Sidebar v-if="!$route.meta.hideSidebar" />
        <!-- Aquí se cargarán las páginas -->
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

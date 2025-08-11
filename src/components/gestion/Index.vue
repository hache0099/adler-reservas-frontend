<script setup>
  import { ref } from 'vue';
  import GestionService from '../../services/gestion.service';
  
  const linksGestion = ref([]);
  const loading = ref(false)
  
  const fetchLinks = async () => {
    loading.value = true;
    linksGestion.value = await GestionService.getModulos();
    loading.value = false;
  }

  fetchLinks();
</script>

<template>
  <div class="container py-4 text-body" data-bs-theme="dark">
     <!-- Header -->
    <div class="bg-secondary-subtle p-3 border border-secondary mb-3 rounded">
      <h5 class="mb-0 fw-semibold">Gestión</h5>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Esperando por links...</p>
    </div>

    <div v-if="!loading">
      <div class="d-flex flex-md-wrap justify-content-center">
        <div v-for="link in linksGestion" class="card link-card" >
          <div class="card-body">
            <h5 class="card-title"><router-link class="stretched-link" :to="link.ruta.substring(0, link.ruta.length -1) ">{{ link.descripcion }}</router-link></h5>
          </div>
          
        </div>

      </div>

    </div>
  </div>
</template>
<style scoped>
.link-card {
  
  max-width: 10rem;
  margin: 1%;
} 
</style>

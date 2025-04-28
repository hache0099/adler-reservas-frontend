<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = 'http://localhost:9000/api/v1'; // Reemplazar por la URL base
const perfiles = ref([]);
const modulos = ref([]);
const perfilSeleccionado = ref(null);
const modulosSeleccionados = ref([]);
const mostrarModal = ref(false);

const cargarDatos = async () => {
  try {
    const perfilesResponse = await axios.get(`${apiUrl}/admin/perfil`);
    const modulosResponse = await axios.get(`${apiUrl}/gestion/get-all-modulos`);
    perfiles.value = perfilesResponse.data;
    modulos.value = modulosResponse.data;
  } catch (error) {
    alert('Error al cargar los datos');
  }
};

const abrirEdicion = (perfil) => {
  perfilSeleccionado.value = perfil;
  modulosSeleccionados.value = perfil.perfil_modulos.map(m => m.modulo_id);
  mostrarModal.value = true;
};

const guardarCambios = async () => {
  try {
    await axios.put(`${apiUrl}/admin/perfil/${perfilSeleccionado.value.id}`, {
      modulos: modulosSeleccionados.value,
    });
    mostrarModal.value = false;
    cargarDatos();
  } catch (error) {
    alert('Error al guardar los cambios');
  }
};

onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <div class="container my-4">
    <h2 class="text-light">Gestión de Perfiles y Módulos</h2>

    <div class="table-responsive">
      <table class="table table-dark table-striped table-bordered align-middle">
        <thead>
          <tr>
            <th>Perfil</th>
            <th>Módulos Accesibles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="perfil in perfiles" :key="perfil.id">
            <td>{{ perfil.descripcion }}</td>
            <td>
              <ul class="mb-0 ps-3">
                <li v-for="modulo in perfil.perfil_modulos" :key="modulo.id">{{ modulo.modulo.descripcion }}</li>
              </ul>
            </td>
            <td>
              <button class="btn btn-sm btn-primary" @click="abrirEdicion(perfil)">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content bg-dark text-light border-light">
          <div class="modal-header">
            <h5 class="modal-title">Editar Módulos de {{ perfilSeleccionado.descripcion }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="mostrarModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div v-for="modulo in modulos" :key="modulo.id" class="col-md-6 mb-2">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'modulo-' + modulo.id"
                    :value="modulo.id"
                    v-model="modulosSeleccionados"
                  >
                  <label class="form-check-label" :for="'modulo-' + modulo.id">
                    {{ modulo.descripcion }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
            <button class="btn btn-success" @click="guardarCambios">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal background -->
    <div v-if="mostrarModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  z-index: 1040;
}
.modal {
  z-index: 1050;
}
</style>

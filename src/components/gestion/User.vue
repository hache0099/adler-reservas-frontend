<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const apiUrl = 'http://localhost:9000/api/v1'; // Cambiar por tu URL base
const usuarios = ref([]);
const perfiles = ref([]);
const usuarioSeleccionado = ref(null);
const perfilSeleccionado = ref(null);
const mostrarModal = ref(false);

const cargarDatos = async () => {
  try {
    const usuariosResponse = await axios.get(`${apiUrl}/user`);
    const perfilesResponse = await axios.get(`${apiUrl}/gestion/get-perfiles`);
    usuarios.value = usuariosResponse.data;
    perfiles.value = perfilesResponse.data;
  } catch (error) {
    alert('Error al cargar usuarios o perfiles', error.message);
  }
};

const abrirEdicion = (usuario) => {
  usuarioSeleccionado.value = usuario;
  perfilSeleccionado.value = usuario.perfil_id;
  mostrarModal.value = true;
};

const guardarCambios = async () => {
  try {
    await axios.put(`${apiUrl}/user/${usuarioSeleccionado.value.id}/update-perfil`, {
      perfil_id: perfilSeleccionado.value
    });
    mostrarModal.value = false;
    cargarDatos();
  } catch (error) {
    alert('Error al guardar los cambios');
  }
};

const resetPassword = async (id) => {
  try {
    if(confirm("Está seguro?")) {
      await axios.post(`${apiUrl}/auth/user/${id}/reset-password`);
      alert('la contraseña se reinició con éxito')
    }
  } catch (error) {
    alert('Error al guardar los cambios');
  }
}


const sendPassResetEmail = async (email) => {
  try {
    Swal.fire({
      title: 'Enviando...',
      text: 'Por favor, espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    await axios.post(`${apiUrl}/auth/forgot-password`, {
      email: email
    });
    Swal.fire({
      icon: 'success',
      title: 'Enlace enviado',
    })
    
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el enlace.'
    });
    console.log(error)
  }
}

const updateEstado = async (usuario) => {
  try{
    if(confirm('Está seguro?')) {
      await axios.post(`${apiUrl}/user/${usuario.id}/toggle-user`,{
        estado: 1 - parseInt(usuario.estado)
      })
      cargarDatos()
    }
  } catch (error) {
    alert('Error al guardar los cambios');
  }
}

onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <div class="container my-4">
     <!-- Header -->
    <div class="bg-secondary-subtle p-3 border border-secondary mb-3 rounded">
      <h5 class="mb-0 fw-semibold">Gestión Usuarios</h5>
    </div>

    <div class="table-responsive">
      <table class="table table-dark table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Documento</th>
            <th>Perfil</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.persona.nombre }}</td>
            <td>{{ usuario.persona.apellido }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.persona.persona_documento.descripcion }}</td>
            <td>{{ usuario.perfile.descripcion }}</td>
            <td>
              <button class="btn btn-sm btn-primary" @click="abrirEdicion(usuario)">
                Editar Perfil
              </button>
              <button class="btn btn-sm btn-danger" @click="sendPassResetEmail(usuario.email)">
                Resetear Contraseña
              </button>
              <button class="btn btn-sm btn-danger" @click="updateEstado(usuario)">
                {{ usuario.estado ? 'Eliminar usuario' : 'Reactivar usuario' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de edición de perfil -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-light border-light">
          <div class="modal-header">
            <h5 class="modal-title">Editar Perfil de {{ usuarioSeleccionado.persona.nombre }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="mostrarModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="perfilSelect" class="form-label">Perfil</label>
              <select id="perfilSelect" class="form-select" v-model="perfilSeleccionado">
                <option v-for="perfil in perfiles" :key="perfil.id" :value="perfil.id">
                  {{ perfil.descripcion }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
            <button class="btn btn-success" @click="guardarCambios">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
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

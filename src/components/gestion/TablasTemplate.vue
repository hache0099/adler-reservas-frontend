<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Ruta actual
const route = useRoute()
const entidad = computed(() => route.path.substring(0,route.path.length -1).split('/').pop())

const nombreEntidad = computed(() => entidad.value.replace('tipo-', '').replace('-', ' '))

const datos = ref([])
const mostrarModal = ref(false)
const form = ref({ id: null, descripcion: '' })

const apiUrl = 'http://localhost:9000/api/v1'

// Cargar datos
const fetchDatos = async () => {
  console.log(`${apiUrl}/admin/${entidad.value}`)
  const { data } = await axios.get(`${apiUrl}/admin/${entidad.value}`)
  datos.value = data
}

// Guardar o actualizar
const guardar = async () => {
  try {
    if (form.value.id) {
      await axios.put(`${apiUrl}/admin/${entidad.value}/${form.value.id}`, form.value)
    } else {
      await axios.post(`${apiUrl}/admin/${entidad.value}`, { ...form.value, estado: 1 })
    }
    cerrarFormulario()
    await fetchDatos()
    alert('Guardado exitosamente')
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Ocurrió un error al guardar el elemento.')
  }
}

// Cambiar estado
const toggleEstado = async (item) => {
  try {
    console.log({
      ...item,
      estado: !item.estado,
    })
    await axios.put(`${apiUrl}/admin/${entidad.value}/${item.id}`, {
      ...item,
      estado: !item.estado,
    })
    await fetchDatos()
    alert(`Elemento ${item.estado ? 'deshabilitado' : 'habilitado'} correctamente`)
  } catch (error) {
    console.error('Error al cambiar el estado:', error)
    alert('Ocurrió un error al cambiar el estado.')
  }
}

// Modal
const abrirFormulario = (item = null) => {
  form.value = item ? { ...item } : { id: null, descripcion: '' }
  mostrarModal.value = true
}
const cerrarFormulario = () => {
  mostrarModal.value = false
  form.value = { id: null, descripcion: '' }
}

onMounted(fetchDatos)
</script>

<template>
  <div class="container py-4 text-body" data-bs-theme="dark">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold text-capitalize">{{ nombreEntidad }}</h4>
      <button class="btn btn-outline-light" @click="abrirFormulario()">Nuevo</button>
    </div>

    <!-- Tabla -->
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in datos" :key="item.id">
          <td>{{ item.descripcion || item.material }}</td>
          <td>
            <span :class="{'text-success': item.estado, 'text-danger': !item.estado}">
              {{ item.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-light me-2" @click="abrirFormulario(item)">
              Editar
            </button>
            <button class="btn btn-sm btn-outline-warning" @click="toggleEstado(item)">
              {{ item.estado ? 'Deshabilitar' : 'Habilitar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulario modal -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? 'Editar' : 'Nuevo' }} {{ nombreEntidad }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarFormulario()"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Descripción</label>
            <input v-model="form.descripcion" class="form-control bg-dark text-light border-light" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="cerrarFormulario()">Cancelar</button>
            <button class="btn btn-outline-light" @click="guardar()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



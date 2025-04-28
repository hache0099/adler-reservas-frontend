<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const canchas = ref([])
const tiposCanchas = ref([])
const mostrarModal = ref(false)
const form = ref({
  id: null,
  max_personas: '',
  tipo_cancha_id: '',
  estado_cancha_id: 1,
  hora_desde: '',
  hora_hasta: '',
})

const apiUrl = 'http://localhost:9000/api/v1'

const fetchCanchas = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/cancha`)
    canchas.value = data
  } catch (e) {
    console.error(e)
    alert('Error al cargar canchas')
  }
}

const fetchTiposCanchas = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/gestion/tipos-cancha`)
    tiposCanchas.value = data
  } catch (e) {
    console.error(e)
    alert('Error al cargar tipos de cancha')
  }
}

const guardar = async () => {
  try {
    if (form.value.id) {
      form.value.estado_cancha_id = form.value.estado_cancha_id ?? canchas.estado_cancha_id;
      await axios.put(`${apiUrl}/cancha/${form.value.id}`, form.value)
    } else {
      await axios.post(`${apiUrl}/cancha`, { ...form.value, estado_cancha_id: 1 }) // Asume "Disponible"
    }
    cerrarFormulario()
    await fetchCanchas()
    alert('Guardado exitosamente')
  } catch (e) {
    console.error(e)
    alert('Error al guardar cancha')
  }
}

const toggleEstado = async (cancha) => {
  try {
    const nuevoEstadoId = cancha.estado_cancha.descripcion === 'Disponible' ? 2 : 1
    await axios.put(`${apiUrl}/cancha/${cancha.id}`,{
      id: cancha.id,
      max_personas: cancha.max_personas,
      tipo_cancha_id: cancha.tipo_cancha_id,
      estado_cancha_id: nuevoEstadoId,
      hora_desde: cancha.horario_canchas.hora_desde,
      hora_hasta: cancha.horario_canchas.hora_hasta,
    })
    await fetchCanchas()
    alert('Estado actualizado')
  } catch (e) {
    console.error(e)
    alert('Error al cambiar estado de la cancha')
  }
}

const abrirFormulario = (cancha = null) => {
  form.value = cancha
  ? {
      id: cancha.id,
      max_personas: cancha.max_personas,
      tipo_cancha_id: cancha.tipo_cancha_id,
      estado_cancha_id: cancha.estado_cancha_id,
      hora_desde: cancha.horario_canchas.hora_desde ?? '',
      hora_hasta: cancha.horario_canchas.hora_hasta ?? '',
    }
  : {
      id: null,
      max_personas: '',
      tipo_cancha_id: '',
      hora_desde: '',
      hora_hasta: '',
    }
  mostrarModal.value = true
}

const cerrarFormulario = () => {
  mostrarModal.value = false
  form.value = { id: null, max_personas: '', tipo_cancha_id: '' }
}

onMounted(() => {
  fetchCanchas()
  fetchTiposCanchas()
})
</script>
<template>
  <div class="container py-4 text-body" data-bs-theme="dark">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold">Gestión de Canchas</h4>
      <button class="btn btn-outline-light" @click="abrirFormulario()">Nueva cancha</button>
    </div>

    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Personas máx.</th>
          <th>Tipo de cancha</th>
          <th>Hora desde</th>
          <th>Hora hasta</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cancha in canchas" :key="cancha.id">
          <td>{{ cancha.id }}</td>
          <td>{{ cancha.max_personas }}</td>
          <td>{{ cancha.tipo_cancha.material }}</td>
          <td> {{ cancha.horario_canchas.hora_desde }} </td>
          <td> {{ cancha.horario_canchas.hora_hasta }} </td>
          <td :class="cancha.estado_cancha.descripcion === 'Disponible' ? 'text-success' : 'text-danger'">
            {{ cancha.estado_cancha.descripcion }}
          </td>
          
          <td>
            <button class="btn btn-sm btn-outline-light me-2" @click="abrirFormulario(cancha)">Editar</button>
            <button class="btn btn-sm btn-outline-warning" @click="toggleEstado(cancha)">
              {{ cancha.estado_cancha.descripcion === 'Disponible' ? 'Eliminar' : 'Habilitar' }}
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
            <h5 class="modal-title">{{ form.id ? 'Editar' : 'Nueva' }} Cancha</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarFormulario()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Personas máx.</label>
              <input type="number" v-model="form.max_personas" class="form-control bg-dark text-light border-light" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tipo de cancha</label>
              <select v-model="form.tipo_cancha_id" class="form-select bg-dark text-light border-light">
                <option v-for="tipo in tiposCanchas" :value="tipo.id" :key="tipo.id">
                  {{ tipo.material }}
                </option>
              </select>
              <div class="mb-3">
                <label class="form-label">Hora desde</label>
                <input type="number" v-model="form.hora_desde" class="form-control bg-dark text-light border-light" min="0" max="23" />
              </div>
              <div class="mb-3">
                <label class="form-label">Hora hasta</label>
                <input type="number" v-model="form.hora_hasta" class="form-control bg-dark text-light border-light" min="0" max="23" />
              </div>
            </div>
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

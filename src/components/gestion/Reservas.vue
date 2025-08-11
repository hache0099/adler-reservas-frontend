<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const apiUrl = 'http://localhost:9000/api/v1/reservas' // Reemplazá esto con tu base real
const reservas = ref([])

const horaActual = ref(new Date().getHours())

const cargarReservas = async () => {
  try {
    const response = await axios.get(`${apiUrl}/reservas-por-fecha`)
    reservas.value = response.data
  } catch (error) {
    alert('Error al cargar reservas del día', error)
  }
}

onMounted(() => {
  cargarReservas()
})

const reservasProximas = computed(() => {
  return reservas.value.filter(r =>
    r.hora === horaActual.value || r.hora === horaActual.value + 1
  )
})

const otrasReservas = computed(() => {
  return reservas.value.filter(
    r => r.hora !== horaActual.value && r.hora !== horaActual.value + 1
  )
})

const marcarIngreso = async (id) => {
  try {
    await axios.post(`${apiUrl}/reservas/${id}/ingreso`)
    alert('Ingreso registrado')
    cargarReservas()
  } catch {
    alert('Error al registrar ingreso')
  }
}

const marcarEgreso = async (id) => {
  try {
    await axios.post(`${apiUrl}/reservas/${id}/egreso`)
    alert('Egreso registrado')
    cargarReservas()
  } catch {
    alert('Error al registrar egreso')
  }
}
</script>

<template>
  <div class="container text-light my-4">
     <!-- Header -->
    <div class="bg-secondary-subtle p-3 border border-secondary mb-3 rounded">
      <h5 class="mb-0 fw-semibold">Gestión de Reservas</h5>
    </div>
    
    <!-- Botones superiores -->
    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-outline-light" @click="$router.push('/gestion')">← Atrás</button>
      <button class="btn btn-outline-info" @click="$router.push('/gestion/reservas/todas')">Ver todas las reservas</button>
    </div>    

    <!-- Sección 1 -->
    <div class="mt-4">
      <h5 class="text-success">Reservas Próximas ({{ horaActual }}:00 y {{ horaActual + 1 }}:00)</h5>
      <div v-if="reservasProximas.length === 0" class="text-muted">Sin reservas próximas.</div>
      <div v-for="reserva in reservasProximas" :key="reserva.id" class="card bg-dark border border-light mb-3">
        <div class="card-body">
          <h6 class="card-title mb-1">Hora: {{ reserva.hora }}:00 | Cancha: {{ reserva.cancha.tipo_cancha.material }}</h6>
          <p class="card-text mb-1">
            Estado: <strong>{{ reserva.estado_reserva.descripcion }}</strong> |
            Pago: <strong>{{ reserva.estado_pago.descripcion }}</strong>
          </p>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-success" @click="marcarIngreso(reserva.id)">Marcar Ingreso</button>
            <button class="btn btn-sm btn-outline-warning" @click="marcarEgreso(reserva.id)">Marcar Egreso</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección 2 -->
    <div class="mt-4">
      <h5 class="text-info">Demás Reservas del Día</h5>
      <div v-if="otrasReservas.length === 0" class="text-muted">No hay más reservas hoy.</div>
      <div v-for="reserva in otrasReservas" :key="reserva.id" class="card bg-dark border border-secondary mb-3">
        <div class="card-body">
          <h6 class="card-title mb-1">Hora: {{ reserva.hora }}:00 | Cancha: {{ reserva.cancha.tipo_cancha.material }}</h6>
          <p class="card-text mb-1">
            Estado: <strong>{{ reserva.estado_reserva.descripcion }}</strong> |
            Pago: <strong>{{ reserva.estado_pago.descripcion }}</strong>
          </p>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-success" @click="marcarIngreso(reserva.id)">Marcar Ingreso</button>
            <button class="btn btn-sm btn-outline-warning" @click="marcarEgreso(reserva.id)">Marcar Egreso</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

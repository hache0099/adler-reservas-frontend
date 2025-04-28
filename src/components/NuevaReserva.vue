<script setup>
import { ref } from 'vue'
import { format, addDays } from 'date-fns'
import ReservaService from '../services/reserva.service'

const selectedHour = ref(5)
const selectedDate = ref('')
const canchaSeleccionada = ref(null)
const canchas = ref([])
const step = ref(1)
const loading = ref(false)

// Generar los próximos 7 días
const upcomingDays = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(new Date(), i)
  return {
    value: format(date, 'yyyy-MM-dd'),
    label: format(date, 'EEEE dd/MM', { locale: undefined }), // Puedes cambiar a 'es' si necesitas español
  }
})

selectedDate.value = upcomingDays[0].value

const incrementHour = () => {
  if (selectedHour.value < 23) selectedHour.value++
}
const decrementHour = () => {
  if (selectedHour.value > 0) selectedHour.value--
}

const fetchCanchas = async () => {
  loading.value = true
  step.value = 2

  canchas.value = await ReservaService.getCanchasDisponibles(selectedDate.value, selectedHour.value)

  loading.value = false
}

const finalizarReserva = async () => {
  const cancha = canchas.value.find(c => c.id === canchaSeleccionada.value)
  const userId = localStorage.getItem('userId')
  
  try {
      const response = await ReservaService.createReserva(selectedDate.value, selectedHour.value, cancha.id, userId)
      
      alert(`Reserva confirmada para el ${selectedDate.value} a las ${selectedHour.value}:00 en ${cancha?.nombre}`)
  } catch (error) {
    alert(`Hubo un problema al hacer la reserva: ${error.message}`)
  }
}
</script>

<template>
  <div class="container py-4 text-body" data-bs-theme="dark">
    <!-- Header -->
    <div class="bg-secondary-subtle p-3 border mb-3 rounded">
      <h5 class="mb-0 fw-semibold">Nueva Reserva</h5>
    </div>

    <!-- Selector de día y hora -->
    <div class="border p-3 rounded mb-4">
      <!-- Día -->
      <h6 class="fw-bold">Día</h6>
      <div class="mb-3">
        <select class="form-select bg-dark text-body border-light" v-model="selectedDate">
          <option v-for="day in upcomingDays" :key="day.value" :value="day.value">
            {{ day.label }}
          </option>
        </select>
      </div>

      <!-- Hora -->
      <h6 class="fw-bold">Hora</h6>
      <p>Elige la hora a la que te gustaría jugar</p>
      <div class="d-flex align-items-center justify-content-center gap-3 my-3">
        <button class="btn btn-outline-light" @click="decrementHour">−</button>
        <span class="fs-4">{{ selectedHour }}:00</span>
        <button class="btn btn-outline-light" @click="incrementHour">+</button>
      </div>
      <div class="text-center">
        <button class="btn btn-light" @click="fetchCanchas" :disabled="loading">
          Confirmar
        </button>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Buscando canchas disponibles...</p>
    </div>

    <!-- Selector de cancha -->
    <div v-if="step >= 2 && !loading" class="border p-3 rounded">
      <h6 class="fw-bold">Canchas</h6>
      <p>Estas son las canchas disponibles</p>
      <div class="d-flex flex-wrap justify-content-center gap-3 mb-3">
        <div v-for="cancha in canchas" :key="cancha.id"
             class="card text-center bg-dark-subtle text-body"
             style="width: 100px; cursor: pointer;"
             :class="{ 'border-light border-2': canchaSeleccionada === cancha.id }"
             @click="canchaSeleccionada = cancha.id">
          <div class="card-body p-2">
            Cancha {{ cancha.id }}
          </div>
        </div>
      </div>
      <div class="text-center">
        <button class="btn btn-outline-light"
                :disabled="!canchaSeleccionada"
                @click="finalizarReserva">
          Finalizar
        </button>
      </div>
    </div>
  </div>
</template>

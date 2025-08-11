<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import ReservaService from '../services/reserva.service'

const router = useRouter()
const defaultHour = (new Date().getHours() + 1) % 24
const selectedHour = ref(defaultHour)
const selectedDate = ref('')
const canchaSeleccionada = ref(null)
const canchas = ref([])
const step = ref(1)
const loading = ref(false)
let debounceTimer = null // NUEVO: Variable para el temporizador

// Generar los próximos 7 días
const upcomingDays = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(new Date(), i)
  return {
    value: format(date, 'yyyy-MM-dd'),
    dayName: format(date, 'E', { locale: es }), // 'lun', 'mar', etc.
    dayNumber: format(date, 'd'), // '27', '28', etc.
  }
})

selectedDate.value = upcomingDays[0].value

const incrementHour = () => {
  if (selectedHour.value < 23) selectedHour.value++
}
const decrementHour = () => {
  if (selectedHour.value > 0) selectedHour.value--
}

const getImageUrl = (id) => {
  // Asume que las imágenes son .jpg. Cambia la extensión si es necesario.
  // La ruta '../assets/img/...' debe ser relativa desde ESTE archivo .vue hasta la carpeta de imágenes.
  return new URL(`../assets/img/canchas/cancha_${id}.jpg`, import.meta.url).href
}

const fetchCanchas = async () => {
  loading.value = true
  step.value = 2

  //const canchasSel = await ReservaService.getCanchasDisponibles(selectedDate.value, selectedHour.value)
  //console.log("canchas encontradas: ", canchasSel)

  canchas.value = await ReservaService.getCanchasDisponibles(selectedDate.value, selectedHour.value)
  console.log(Array.isArray(canchas.value))

  loading.value = false
}

const finalizarReserva = async () => {
  //console.log("valor de canchas:", canchas.value)
  const cancha = canchas.value.find(c => c.id === canchaSeleccionada.value)
  const userId = localStorage.getItem('userId')
  
  try {
      const response = await ReservaService.createReserva(selectedDate.value, selectedHour.value, cancha.id, userId)
      
      alert(`Reserva confirmada para el ${selectedDate.value} a las ${selectedHour.value}:00 en ${cancha?.nombre}`)
      router.push('/reservas');
  } catch (error) {
    alert(`Hubo un problema al hacer la reserva: ${error.message}`)
  }
}

watch([selectedDate, selectedHour], () => {
  // 1. Mostrar el spinner inmediatamente para dar feedback
  loading.value = true;
  canchas.value = []; // Opcional: limpiar resultados anteriores inmediatamente

  // 2. Reiniciar el timer cada vez que hay un cambio
  clearTimeout(debounceTimer)

  // 3. Establecer un nuevo timer
  debounceTimer = setTimeout(() => {
    fetchCanchas()
  }, 500) // 1000 ms = 1 segundo
}, {
  immediate: true // Para que se ejecute la primera vez que se carga el componente
})
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
      <div class="d-flex gap-2 overflow-auto pb-2">
        <div v-for="day in upcomingDays" :key="day.value"
             class="date-selector-btn"
             :class="{ 'active': selectedDate === day.value }"
             @click="selectedDate = day.value">
          <span class="day-name">{{ day.dayName }}</span>
          <span class="day-number">{{ day.dayNumber }}</span>
        </div>
      </div>

      <!-- Hora -->
      <h6 class="fw-bold">Hora</h6>
      <p>Elige la hora a la que te gustaría jugar</p>
      <div class="d-flex align-items-center justify-content-center gap-3 my-3">
        <button class="btn btn-outline-light" @click="decrementHour">−</button>
        <span class="fs-4">{{ selectedHour }}:00</span>
        <button class="btn btn-outline-light" @click="incrementHour">+</button>
      </div>
      <!--div class="text-center">
        <button class="btn btn-light" @click="fetchCanchas" :disabled="loading">
          Confirmar
        </button>
      </div-->
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
      <h6 class="fw-bold">Canchas disponibles</h6>
      <p v-if="canchas.length > 0">Selecciona una de las canchas disponibles para la fecha y hora elegidas.</p>
      <p v-else class="text-warning">No hay canchas disponibles en este horario. Por favor, intenta con otra fecha u hora.</p>
      
      <!-- Contenedor de las tarjetas de canchas -->
      <div v-if="canchas.length > 0" class="d-flex flex-wrap justify-content-center gap-4 mb-3">
        
        <!-- Tarjeta de cancha (Iteración con v-for) -->
        <div v-for="cancha in canchas" :key="cancha.id"
             class="card bg-dark text-light"
             style="width: 18rem; cursor: pointer;"
             :class="{ 'border-primary border-3': canchaSeleccionada === cancha.id }"
             @click="canchaSeleccionada = cancha.id">
          
          <!-- Imagen: Usamos un placeholder ya que el JSON no incluye URL de imagen -->
          <img :src="getImageUrl(cancha.id)" 
               class="card-img-top" 
               :alt="`Imagen de la cancha ${cancha.id}`">
          
          <div class="card-body">
            <h5 class="card-title">Cancha N° {{ cancha.id }}</h5>
            <ul class="list-unstyled">
              <li><strong>Tipo:</strong> {{ cancha.tipo_cancha?.material || 'No especificado' }}</li>
              <li><strong>Capacidad:</strong> {{ cancha.max_personas }} personas</li>
              <li><strong>Precio:</strong> ${{ cancha.precio_actual?.precio || 'N/A' }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-4" v-if="canchas.length > 0">
        <button class="btn btn-primary"
                :disabled="!canchaSeleccionada"
                @click="finalizarReserva">
          Finalizar Reserva
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-selector-btn {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: var(--bs-dark-bg-subtle);
}

.date-selector-btn:hover {
  background-color: var(--bs-secondary-bg-subtle);
}

.date-selector-btn.active {
  background-color: var(--bs-light);
  color: var(--bs-dark);
  border-color: var(--bs-light);
  font-weight: bold;
}

.day-name {
  font-size: 0.8rem;
  text-transform: capitalize;
}

.day-number {
  font-size: 1.5rem;
  line-height: 1.2;
}

/* Para que el scroll sea más discreto en webkit */
.overflow-auto::-webkit-scrollbar {
  height: 5px;
}
.overflow-auto::-webkit-scrollbar-thumb {
  background: var(--bs-secondary);
  border-radius: 10px;
}
</style>

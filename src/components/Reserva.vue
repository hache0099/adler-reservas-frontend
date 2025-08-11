<script setup>
import { ref } from 'vue';
import { format } from 'date-fns';
import ReservaService from '../services/reserva.service';

const pendientes = ref([]);
const todas = ref([]);

const getReservasPendientes = async () => {
  try {
    pendientes.value = await ReservaService.getReservasPendientes()
  } catch (error) {
    alert(error.message)
  }
} 

const getTodasReservas = async () => {
  try {
    todas.value = await ReservaService.getTodasReservas()
  } catch (error) {
    alert(error.message)
  }
} 

// Al recibir los datos, añadí un campo para controlar el despliegue
const setPendientes = (reservas) => {
  pendientes.value = reservas.map(r => ({
    ...r,
    mostrarDetalle: false
  }))
}

const setTodass = (reservas) => {
  todas.value = reservas.map(r => ({
    ...r,
    mostrarDetalle: false
  }))
}

const toggleDetalle = (index) => {
  pendientes.value[index].mostrarDetalle = !pendientes.value[index].mostrarDetalle
}

const toggleDetalleTodas = (index) => {
  todas.value[index].mostrarDetalle = !todas.value[index].mostrarDetalle
}

const formatFecha = (fechaStr) => {
  const date = new Date(fechaStr)
  return format(date, 'dd/MM/yyyy')
}


getReservasPendientes();
getTodasReservas();

</script>

<template>
  <div class="container mt-4 px-3 text-body" data-bs-theme="dark">
    <!-- Header -->
    <div class="bg-secondary-subtle p-3 border border-secondary mb-3 rounded">
      <h5 class="mb-0 fw-semibold">Reservas</h5>
    </div>

    <!-- Botón Nueva Reserva -->
    <div class="mb-3">
      <button @click="this.$router.push('/reservas/nueva')" class="btn btn-outline-light w-100">
        Nueva Reserva
      </button>
    </div>

    <!-- Pendientes -->
    <div class="mb-3">
      <h6 class="fw-bold">Pendientes</h6>
      <div class="border border-secondary rounded p-2 bg-dark-subtle" style="max-height: 250px; overflow-y: auto;">
        <p v-if="pendientes.length === 0" class="text-muted small">No hay reservas pendientes.</p>

        <ul v-else class="list-unstyled mb-0">
          <li v-for="(reserva, index) in pendientes" :key="index" class="mb-3 border-bottom pb-2">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ formatFecha(reserva.fecha) }}</strong> a las <strong>{{ reserva.hora }}:00</strong><br />
                Cancha: {{ reserva.cancha.tipo_cancha.material }}<br />
                Estado: <span :class="reserva.estado_reserva.descripcion === 'Pendiente' ? 'text-warning' : 'text-success'">
                  {{ reserva.estado_reserva.descripcion }}
                </span>
              </div>
              <button class="btn btn-sm btn-outline-light" @click="toggleDetalle(index)">
                {{ reserva.mostrarDetalle ? 'Ocultar' : 'Ver' }} detalles
              </button>
            </div>

            <!-- Detalles -->
            <div v-if="reserva.mostrarDetalle" class="mt-2 small bg-body-tertiary p-2 rounded">
              <p class="mb-1">Monto total: ${{ reserva.monto_total }}</p>
              <p class="mb-1">Monto pagado: ${{ reserva.monto_pagado }}</p>
              <p class="mb-1">Estado de pago: {{ reserva.estado_pago.descripcion }}</p>
              <p class="mb-1">ID de Reserva: {{ reserva.id }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Todas mis reservas -->
    <div class="mb-3">
      <h6 class="fw-bold">Todas mis reservas</h6>
      <div class="border border-secondary rounded p-2 bg-dark-subtle" style="max-height: 250px; overflow-y: auto;">
        <p v-if="todas.length === 0" class="text-muted small">No hay reservas registradas.</p>

        <ul v-else class="list-unstyled mb-0">
          <li v-for="(reserva, index) in todas" :key="index" class="mb-3 border-bottom pb-2">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ formatFecha(reserva.fecha) }}</strong> a las <strong>{{ reserva.hora }}:00</strong><br />
                Cancha: {{ reserva.cancha.tipo_cancha.material }}<br />
                Estado: <span :class="reserva.estado_reserva.descripcion === 'Pendiente' ? 'text-warning' : 'text-success'">
                  {{ reserva.estado_reserva.descripcion }}
                </span>
              </div>
              <button class="btn btn-sm btn-outline-light" @click="toggleDetalleTodas(index)">
                {{ reserva.mostrarDetalle ? 'Ocultar' : 'Ver' }} detalles
              </button>
            </div>

            <!-- Detalles -->
            <div v-if="reserva.mostrarDetalle" class="mt-2 small bg-body-tertiary p-2 rounded">
              <p class="mb-1">Monto total: ${{ reserva.monto_total }}</p>
              <p class="mb-1">Monto pagado: ${{ reserva.monto_pagado }}</p>
              <p class="mb-1">Estado de pago: {{ reserva.estado_pago.descripcion }}</p>
              <p class="mb-1">ID de Reserva: {{ reserva.id }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


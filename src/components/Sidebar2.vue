<script>
export default {
  name: 'Sidebar',
  data() {
    return {    
      nombre: '',
      apellido: '',
      perfil: 3,
    }
  },
  props: {
    // You can add props here if you need to customize the sidebar
  },
  methods: {
    getNombreApellido() {
      this.nombre = localStorage.getItem('nombre');
      this.apellido = localStorage.getItem('apellido');
    },
    
    getUserProfile() {
      this.perfil = localStorage.getItem('userPerfil') !== null ? parseInt(localStorage.getItem('userPerfil')) : 3
    }
  },
  created() {
    this.getNombreApellido()
    this.getUserProfile()
  }
}
</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px; height: 100vh">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <svg class="bi pe-none me-2" width="40" height="32"><use xlink:href="#bootstrap"/></svg>
      <span class="fs-4">Sidebar</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item text-white">
        <a href="/" class="nav-link">
          <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#home"/></svg>
          Home
        </a>
      </li>
      <li>
        <a href="/reservas" class="nav-link text-white">
          <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#speedometer2"/></svg>
          Reservas
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#table"/></svg>
          Orders
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#grid"/></svg>
          Products
        </a>
      </li>
      <li v-if="perfil !== 3">
        <a href="/gestion" class="nav-link text-white">
          <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#grid"/></svg>
          Gestión
        </a>
      </li>

    </ul>
    <hr>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <!--img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2"-->
        <strong>{{ nombre + ' ' + apellido }}</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
        <li><a class="dropdown-item" href="#">New project...</a></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="/logout">Cerrar sesión</a></li>
      </ul>
    </div>
  </div>
</template>

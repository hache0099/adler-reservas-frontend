<script>
export default {
  name: 'Sidebar',
  props: {
    // You can add props here if you need to customize the sidebar
  }
}
</script>

<template>
  <div class="sidebar bg-dark text-white d-flex flex-column">
    <!-- Logo -->
    <div class="logo-container p-3 text-center">
      <div class="logo-placeholder position-relative">
        <div class="placeholder-content d-flex align-items-center justify-content-center">
          <span class="bg-white text-dark px-2">LOGO</span>
        </div>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="mt-4">
      <ul class="nav flex-column">
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Home</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Reservas</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Canchas</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Socios</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-light text-dark py-3">Gestión</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Item 2</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Item 3</a>
        </li>
        <li class="nav-item border-bottom">
          <a href="#" class="nav-link bg-white text-dark py-3">Item 4</a>
        </li>
      </ul>
    </nav>
    
    <!-- Spacer to push logout to bottom -->
    <div class="flex-grow-1"></div>
    
    <!-- Logout Button -->
    <div class="logout-container p-3 text-center">
      <button class="btn btn-light btn-block w-100 py-2">Cerrar Sesión</button>
    </div>
    
    <!-- Copyright -->
    <div class="copyright-container p-3 text-center text-muted">
      <small>Copyright</small>
    </div>
  </div>
</template>


<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.logo-container {
  min-height: 100px;
}

.logo-placeholder {
  width: 100%;
  aspect-ratio: 1/1;
  border: 1px solid #555;
  position: relative;
}

.placeholder-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 10px,
    rgba(0, 0, 0, 0.2) 10px,
    rgba(0, 0, 0, 0.2) 20px
  );
}

.nav-item a {
  border-left: none;
  border-right: none;
}

/* Highlight active menu item */
.nav-item a.active {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes (páginas)
import Login from '../components/Login.vue';
import Home from '../components/HelloWorld.vue'; // Ejemplo adicional
import Register from '../components/Register.vue';

// Define las rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Página principal
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // Página de login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register, // Página de registro
  }
];

// Crea el router
const router = createRouter({
  history: createWebHistory(),
  routes, // Rutas definidas
});

export default router;

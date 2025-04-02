// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes (páginas)
//import Login from '../views/Login.vue';
import Home from '../components/Helloworld.vue'; // Ejemplo adicional

// Define las rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Página principal
  },
  /*{
    path: '/login',
    name: 'Login',
    component: Login, // Página de login
  },*/
];

// Crea el router
const router = createRouter({
  history: createWebHistory(),
  routes, // Rutas definidas
});

export default router;

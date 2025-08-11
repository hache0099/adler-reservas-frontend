// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes (páginas)
import Login from '../components/Login.vue';
import Logout from '../components/Logout.vue';
import Home from '../components/Home.vue'; 
import Register from '../components/Register.vue';
import Profile from '../components/Profile.vue';
import Reserva from '../components/Reserva.vue';
import NuevaReserva from '../components/NuevaReserva.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import ResetPassword from '../components/ResetPassword.vue';
import Gestion from '../components/gestion/Index.vue';
import TablasTemplate from '../components/gestion/TablasTemplate.vue';
import GestionCanchas from '../components/gestion/Cancha.vue';
import GestionPerfiles from '../components/gestion/Perfil.vue';
import GestionUsuarios from '../components/gestion/User.vue';
import GestionReservas from '../components/gestion/Reservas.vue';

// Define las rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Página principal
    meta: {hideSidebar: true},
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // Página de login
    meta: {hideSidebar: true},
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {hideSidebar: true},
  },
  {
    path: '/register',
    name: 'Register',
    component: Register, // Página de registro
    meta: {hideSidebar: true},
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    component: ForgotPassword,
    meta: {hideSidebar: true},
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    component: ResetPassword,
    meta: {hideSidebar: true},
  },
  {
    path: '/profile',
    name: 'Perfil',
    component: Profile,
    meta: {hideSidebar: false},
  },
  {
    path: '/reservas',
    name: 'Reservas',
    component: Reserva,
    meta: {hideSidebar: false},
  },
  {
    path: '/reservas/nueva',
    name: 'Nueva Reserva',
    component: NuevaReserva,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion',
    name: 'Gestion',
    component: Gestion,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/tipos-documento',
    name: 'Gestion Tipos Documento',
    component: TablasTemplate,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/tipos-contacto',
    name: 'Gestion Tipos Contacto',
    component: TablasTemplate,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/tipos-domicilio',
    name: 'Gestion Tipos Domicilio',
    component: TablasTemplate,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/tipos-cancha',
    name: 'Gestion Tipos Cancha',
    component: TablasTemplate,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/canchas',
    name: 'Gestion Canchas',
    component: GestionCanchas,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/perfiles',
    name: 'Gestion Perfiles',
    component: GestionPerfiles,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/usuarios',
    name: 'Gestion Usuarios',
    component: GestionUsuarios,
    meta: {hideSidebar: false},
  },
  {
    path: '/gestion/reservas',
    name: 'Gestion Reservas',
    component: GestionReservas,
    meta: {hideSidebar: false},
  },
];

// Crea el router
const router = createRouter({
  history: createWebHistory(),
  routes, // Rutas definidas
});

router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.getItem('userToken') !== null;
  const noAuthReq = [
    'Register', 
    'Login', 
    'Home', 
    'Forgot Password', 
    'Reset Password',
  ];

  if(!isAuthenticated && !noAuthReq.includes(to.name)){
    return { name: 'Login' }
  }
});

export default router;

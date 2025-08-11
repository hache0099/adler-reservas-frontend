<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const password = ref('');
const password_confirmation = ref('');
const token = ref(null);
const email = ref(null);

// Al cargar el componente, obtenemos el token y el email de la URL
onMounted(() => {
  token.value = route.query.token;
  email.value = route.query.email;

  if (!token.value || !email.value) {
    Swal.fire({
      icon: 'error',
      title: 'Enlace Inválido',
      text: 'El enlace de reseteo no es válido o ha expirado.',
    }).then(() => {
      router.push('/login'); // Redirige si no hay token
    });
  }
});

const handleResetPassword = async () => {
  if (password.value !== password_confirmation.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Las contraseñas no coinciden.',
    });
    return;
  }

  try {
    Swal.fire({
      title: 'Actualizando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading() }
    });

    // Cambia la URL por la de tu API
    await axios.post('http://localhost:9000/api/v1/auth/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    
    await Swal.fire({
      icon: 'success',
      title: '¡Contraseña Actualizada!',
      text: 'Tu contraseña ha sido cambiada con éxito.',
    });

    // Redirige al login después del éxito
    router.push('/login');

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cambiar la contraseña. El enlace puede haber expirado.',
    });
    console.error("Error en reset-password:", error);
  }
};
</script>
<template>
  <div class="login-container">
    <h1>Crear Nueva Contraseña</h1>
    <form @submit.prevent="handleResetPassword" class="login-form">
      <div class="form-group">
        <label for="password">Nueva Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="••••••••" 
          required
        />
      </div>
      <div class="form-group">
        <label for="password_confirmation">Confirmar Contraseña</label>
        <input 
          type="password" 
          id="password_confirmation" 
          v-model="password_confirmation" 
          placeholder="••••••••" 
          required
        />
      </div>
      <button type="submit" class="submit-btn">Cambiar Contraseña</button>
    </form>
  </div>
</template>

<style scoped>
/* Los estilos son idénticos a los de tu componente Login.vue */
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #369f6b;
}
</style>

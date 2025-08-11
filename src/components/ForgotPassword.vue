<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const email = ref('');

const handleForgotPassword = async () => {
  try {
    // Muestra una alerta de carga
    Swal.fire({
      title: 'Enviando...',
      text: 'Por favor, espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    await axios.post('http://localhost:9000/api/v1/auth/forgot-password', {
      email: email.value
    });

    // Muestra mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Enlace Enviado!',
      text: 'Revisa tu bandeja de entrada. Te hemos enviado un enlace para resetear tu contraseña.'
    });

  } catch (error) {
    // Muestra mensaje de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el enlace. Verifica que el correo electrónico sea correcto e inténtalo de nuevo.'
    });
    console.error("Error en forgot-password:", error);
  }
};
</script>

<template>
  <div class="login-container">
    <h1>Recuperar Contraseña</h1>
    <p class="info-text">
      Ingresa tu correo electrónico y te enviaremos un enlace para que puedas recuperar tu cuenta.
    </p>
    <form @submit.prevent="handleForgotPassword" class="login-form">
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="tu@email.com" 
          required
        />
      </div>
      <button type="submit" class="submit-btn">Enviar Enlace</button>
    </form>
    <p class="signup-link">
      ¿Recordaste tu contraseña? <router-link to="/login">Iniciar sesión</router-link>
    </p>
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

.info-text {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
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

.signup-link {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.signup-link a {
  color: #42b983;
  text-decoration: none;
}
</style>

<script>
import authService from '../services/auth.service'; 

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null, // Para manejar errores
      isLoading: false // Para deshabilitar el botón durante la carga
    };
  },
  methods: {
    async handleSubmit() {
      this.error = null;
      this.isLoading = true;

      try {
        console.log("logeando...")
        const response = await authService.login(this.email, this.password);
        
        // Si el backend devuelve un token:
        if (response.data.token) {
          //console.log(response);
          //breakpoint
          const a = authService.storeUserData(response.data);

          this.$router.push('/profile'); // Redirige al dashboard
        }
      } catch (err) {
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<template>
  <div class="login-container">
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="handleSubmit" class="login-form">
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
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="••••••••" 
          required
        />
      </div>
      <button type="submit" class="submit-btn">Ingresar</button>
    </form>
    <div v-if="error">
        {{ error }}
    </div>
    <p class="signup-link">
      ¿No tienes cuenta? <a href="#">Regístrate</a>
    </p>
  </div>
</template>

<style scoped>
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

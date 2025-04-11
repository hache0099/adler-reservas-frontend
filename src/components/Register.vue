<script>
import authService from '../services/auth.service';

export default {
  data() {
    return {
      currentStep: 1,
      form: {
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
        apellido: '',
        domicilio: '',
        tipodni: '',
        dni: '',
        telefono: '',
        fechanac: ''
      },
      tiposDocumento: [],
      errors: {},
      serverErrors: [],
      emailChecking: false,
      lastCheckedEmail: '' // Para evitar verificaciones duplicadas
    }
  },
  created() {
    this.fetchDocumentTypes();
  },
  methods: {
    async fetchDocumentTypes() {
      try {
        const response = await authService.getDocumentTypes();
        this.tiposDocumento = response.data;
      } catch (error) {
        console.error('Error fetching document types:', error);
        this.serverErrors = ['No se pudieron cargar los tipos de documento'];
      }
    },
    
    async checkEmail() {
      if (!this.form.email || this.form.email === this.lastCheckedEmail) return;
      
      this.emailChecking = true;
      this.lastCheckedEmail = this.form.email;
      
      try {
        const response = await authService.checkEmail(this.form.email);
        if (response.data.exists) {
          this.errors.email = 'Este email ya está registrado';
        } else {
          delete this.errors.email;
        }
      } catch (error) {
        console.error('Error checking email:', error);
        this.errors.email = 'Error verificando email';
      } finally {
        this.emailChecking = false;
      }
    },
    
    validateStep1() {
      this.errors = {};
      let isValid = true;
      
      // Validación de email
      if (!this.form.email) {
        this.errors.email = 'El email es requerido';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.errors.email = 'Email no válido';
        isValid = false;
      }
      
      // Validación de contraseña
      if (!this.form.password) {
        this.errors.password = 'La contraseña es requerida';
        isValid = false;
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Mínimo 8 caracteres';
        isValid = false;
      }
      
      // Confirmación de contraseña
      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = 'Las contraseñas no coinciden';
        isValid = false;
      }
      
      return isValid;
    },
    nextStep() {
      if (this.validateStep1()) {
        this.currentStep = 2;
      }
    },
    prevStep() {
      this.currentStep = 1;
    },
    
    async submitForm() {
      this.serverErrors = [];
      
      try {
        const response = await authService.register(this.form);
        this.$router.push('/login?registered=true');
      } catch (error) {
        this.handleRegistrationError(error);
      }
    },
    
    handleRegistrationError(error) {
      if (error.response) {
        // Manejo de errores del backend
        if (error.response.status === 422) {
          this.serverErrors = Object.values(error.response.data.errors).flat();
          
          // Si hay error con el email, volver al paso 1
          if (error.response.data.errors.email) {
            this.currentStep = 1;
            this.errors.email = error.response.data.errors.email[0];
          }
        } else {
          this.serverErrors = [error.response.data.message || 'Error en el registro'];
        }
      } else {
        this.serverErrors = ['Error de conexión'];
      }
    }
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center" data-bs-theme="dark" >
    <div class="p-4 border rounded-3 " style="max-width: 450px; width: 100%;">
      <h1 class="text-center mb-4">Registro</h1>
      
      <!-- Paso 1: Setup de cuenta -->
      <form v-if="currentStep === 1" @submit.prevent="nextStep">
        <h2>Usuario</h2>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.email"
            @blur="checkEmail"
            :class="{ 'is-invalid': errors.email }"
            class="form-control" 
            type="email" 
            id="email" 
          >
          <label for="email">Correo electrónico</label>
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
          <div v-if="emailChecking" class="text-muted small">Verificando email...</div>
        </div>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.password"
            :class="{ 'is-invalid': errors.password }"
            class="form-control" 
            type="password" 
            id="password" 
            
          >
          <label for="password">Contraseña</label>
          <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
        </div>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.password_confirmation"
            :class="{ 'is-invalid': errors.password_confirmation }"
            class="form-control" 
            type="password" 
            id="password_confirmation" 
            
          >
          <label for="password_confirmation">Confirmar contraseña</label>
        </div>
        
        <button class="btn btn-primary w-100" type="submit">Continuar</button>
      </form>
      
      <!-- Paso 2: Datos personales -->
      <form v-if="currentStep === 2" @submit.prevent="submitForm">
        <h2>Datos personales</h2>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.name"
            :class="{ 'is-invalid': errors.name }"
            class="form-control" 
            type="text" 
            id="name" 
            required
          >
          <label for="name">Nombre</label>
        </div>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.apellido"
            :class="{ 'is-invalid': errors.apellido }"
            class="form-control" 
            type="text" 
            id="apellido" 
            required
          >
          <label for="apellido">Apellido</label>
        </div>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.domicilio"
            :class="{ 'is-invalid': errors.domicilio }"
            class="form-control" 
            type="text" 
            id="domicilio" 
            required
          >
          <label for="domicilio">Domicilio</label>
        </div>
        
        <select 
          v-model="form.tipodni"
          :class="{ 'is-invalid': errors.tipodni }"
          class="form-select mb-3"
          id="tipodni"
          required
        >
          <option value="" selected>Tipo de Documento</option>
          <option v-for="doc in tiposDocumento" :value="doc.id">
            {{ doc.descripcion }}
          </option>
        </select>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.dni"
            :class="{ 'is-invalid': errors.dni }"
            class="form-control" 
            type="number" 
            id="dni" 
            required
          >
          <label for="dni">DNI</label>
        </div>
        
        <div class="form-floating mb-3">
          <input 
            v-model="form.telefono"
            :class="{ 'is-invalid': errors.telefono }"
            class="form-control" 
            type="number" 
            id="telefono" 
            required
          >
          <label for="telefono">Teléfono</label>
        </div>
        
        <div class="mb-3">
          <label for="fechanac" class="form-label">Fecha Nacimiento</label>
          <input 
            v-model="form.fechanac"
            :class="{ 'is-invalid': errors.fechanac }"
            class="form-control" 
            type="date" 
            id="fechanac" 
            required
          >
        </div>
        
        <div class="d-flex justify-content-between">
          <button class="btn btn-secondary" @click="prevStep" type="button">Atrás</button>
          <button class="btn btn-primary" type="submit">Registrarse</button>
        </div>
      </form>
      
      <!-- Mostrar errores -->
      <div v-if="serverErrors.length" class="alert alert-danger mt-3">
        <ul class="mb-0">
          <li v-for="error in serverErrors">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>



<style scoped>
.form-select {
  height: 58px; /* Para igualar altura con inputs flotantes */
}
</style>

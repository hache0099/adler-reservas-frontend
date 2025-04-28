<script>
import UserService from '../services/user.service';


export default {
  name: 'UserProfile',
  data() {
    return {
      loading: true,
      error: null,
      userData: {
        persona: {
          nombre: '',
          apellido: '',
          fecha_nacimiento: '',
          persona_documento: {
            descripcion: '',
            tipo_documento: { descripcion: '' }
          },
          domicilio: {
            detalle: '',
            tipo_domicilio: { descripcion: '' }
          },
          persona_contactos: []
        }
      },
      documentTypes: [],
      addressTypes: [],
      contactTypes: [],
      editMode: {
        personal: false,
        contact: false,
        address: false
      },
      editForm: {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        tipo_documento_id: '',
        documento: '',
        // ... otros campos del formulario
      },
      updating: false
    }
  },
  computed: {
    formattedBirthDate() {
      if (!this.userData.persona.fecha_nacimiento) return '';
      const date = new Date(this.userData.persona.fecha_nacimiento);
      return date.toLocaleDateString('es-AR');
    },
    phoneNumber() {
      const phone = this.userData.persona.persona_contactos.find(
        c => c.tipo_contacto.descripcion.toLowerCase().includes('telefono')
      );
      return phone ? phone.descripcion : 'No especificado';
    }
  },
  created() {
    this.fetchUserProfile();
    this.fetchReferenceData();
  },
  methods: {
    // Obtener datos del perfil
    async fetchUserProfile() {
      this.loading = true;
      this.error = null;
      
      try {
        this.userData = await UserService.getProfile();
        this.resetEditForm();
      } catch (error) {
        //this.error = 'No se pudo cargar el perfil. ' + error.message;
        console.error('Error al cargar perfil:', error.message);
      } finally {
        this.loading = false;
      }
    },

    // Obtener datos de referencia (tipos de documento, etc.)
    async fetchReferenceData() {
      try {
        const [docs, addresses, contacts] = await Promise.all([
          UserService.getDocumentTypes(),
          UserService.getAddressTypes(),
          UserService.getContactTypes()
        ]);
        
        this.documentTypes = docs;
        this.addressTypes = addresses;
        this.contactTypes = contacts;
      } catch (error) {
        console.error('Error al cargar datos de referencia:', error);
      }
    },

    // Actualizar información personal
    async updatePersonalInfo() {
      this.updating = true;
      
      try {
        const updatedData = {
          nombre: this.editForm.nombre,
          apellido: this.editForm.apellido,
          fecha_nacimiento: this.editForm.fecha_nacimiento,
          documento: {
            tipo_documento_id: this.editForm.tipo_documento_id,
            descripcion: this.editForm.documento
          }
        };
        
        const updatedProfile = await UserService.updateProfile(updatedData);
        this.userData = updatedProfile;
        this.editMode.personal = false;
        //this.$toast.success('Datos personales actualizados correctamente');
        console.log('Datos personales actualizados correctamente');
      } catch (error) {
        //this.$toast.error('Error al actualizar: ' + error.message);
        console.error('Error al actualizar perfil:', error);
      } finally {
        this.updating = false;
      }
    },

    // [Métodos similares para updateContactInfo y updateAddressInfo]
    async updateContactInfo() {
      this.updating = true;
      
      try {
        const updatedData = {
          contacto: {
            tipo_contacto_id: this.editForm.tipo_contacto_id,
            descripcion: this.editForm.telefono
          }
        };
        
        const updatedProfile = await UserService.updateProfile(updatedData);
        this.userData = updatedProfile;
        this.editMode.contact = false;
        console.log('Información de contacto actualizada correctamente');
        
        // Actualizar la lista de contactos en el objeto userData
        this.userData.persona.persona_contactos = this.userData.persona.persona_contactos.map(c => 
          c.tipo_contacto.id === this.editForm.tipo_contacto_id ? 
          { ...c, descripcion: this.editForm.telefono } : c
        );
        
      } catch (error) {
        console.error('Error al actualizar contacto:', error);
      } finally {
        this.updating = false;
      }
    },

    async updateAddressInfo() {
      this.updating = true;
      
      try {
        const updatedData = {
          domicilio: {
            detalle: this.editForm.domicilio,
            tipo_domicilio_id: this.editForm.tipo_domicilio_id
          }
        };
        
        const updatedProfile = await UserService.updateProfile(updatedData);
        this.userData = updatedProfile;
        this.editMode.address = false;
        console.log('Dirección actualizada correctamente');
        
        // Actualizar los datos de domicilio localmente
        this.userData.persona.domicilio = {
          ...this.userData.persona.domicilio,
          detalle: this.editForm.domicilio,
          tipo_domicilio: {
            id: this.editForm.tipo_domicilio_id,
            descripcion: this.addressTypes.find(a => a.id === this.editForm.tipo_domicilio_id)?.descripcion || ''
          }
        };
        
      } catch (error) {
        console.error('Error al actualizar dirección:', error);
      } finally {
        this.updating = false;
      }
    },

    // Resetear formulario de edición con los datos actuales
    resetEditForm() {
      // Datos personales
      this.editForm = {
        nombre: this.userData.persona.nombre,
        apellido: this.userData.persona.apellido,
        fecha_nacimiento: this.userData.persona.fecha_nacimiento.split('T')[0],
        tipo_documento_id: this.userData.persona.persona_documento.tipo_documento.id,
        documento: this.userData.persona.persona_documento.descripcion,
        
        // Datos de contacto
        telefono: this.phoneNumber,
        tipo_contacto_id: this.userData.persona.persona_contactos.find(
          c => c.tipo_contacto.descripcion.toLowerCase().includes('telefono')
        )?.tipo_contacto.id || this.contactTypes[0]?.id,
        
        // Datos de domicilio
        domicilio: this.userData.persona.domicilio.detalle,
        tipo_domicilio_id: this.userData.persona.domicilio.tipo_domicilio.id
      };
    },

    // Alternar modo edición
    toggleEditMode(section) {
      this.editMode[section] = !this.editMode[section];
      if (this.editMode[section]) {
        this.resetEditForm();
      }
    }
  }
}
</script>

<template data-bs-theme="dark">
  <div class="profile-container" data-bs-theme="dark">
    <div class="card profile-card">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">Mi Perfil</h2>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando tu perfil...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
          <button @click="fetchUserProfile" class="btn btn-sm btn-outline-danger ms-2">
            Reintentar
          </button>
        </div>

        <!-- Profile Data -->
        <template v-else>
          <!-- Sección Información Personal -->
          <div class="profile-section">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="section-title">Información Personal</h3>
              <button @click="toggleEditMode('personal')" class="btn btn-sm btn-outline-primary">
                {{ editMode.personal ? 'Cancelar' : 'Editar' }}
              </button>
            </div>

            <form v-if="editMode.personal" @submit.prevent="updatePersonalInfo" class="mt-3">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre</label>
                  <input v-model="editForm.nombre" type="text" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Apellido</label>
                  <input v-model="editForm.apellido" type="text" class="form-control" required>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fecha de Nacimiento</label>
                  <input v-model="editForm.fecha_nacimiento" type="date" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Documento</label>
                  <div class="input-group">
                    <select v-model="editForm.tipo_documento_id" class="form-select" required>
                      <option v-for="doc in documentTypes" :key="doc.id" :value="doc.id">
                        {{ doc.descripcion }}
                      </option>
                    </select>
                    <input v-model="editForm.documento" type="text" class="form-control" required>
                  </div>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary" :disabled="updating">
                <span v-if="updating" class="spinner-border spinner-border-sm" role="status"></span>
                Guardar cambios
              </button>
            </form>

            <div v-else class="row">
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">{{ userData.persona.nombre }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Apellido:</span>
                  <span class="info-value">{{ userData.persona.apellido }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Fecha de Nacimiento:</span>
                  <span class="info-value">{{ formattedBirthDate }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Documento:</span>
                  <span class="info-value">
                    {{ userData.persona.persona_documento.descripcion }} 
                    ({{ userData.persona.persona_documento.tipo_documento.descripcion }})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sección Contacto -->
          <div class="profile-section">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="section-title">Contacto</h3>
              <button @click="toggleEditMode('contact')" class="btn btn-sm btn-outline-primary">
                {{ editMode.contact ? 'Cancelar' : 'Editar' }}
              </button>
            </div>

            <form v-if="editMode.contact" @submit.prevent="updateContactInfo" class="mt-3">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono</label>
                  <input v-model="editForm.telefono" type="tel" class="form-control" required>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="updating">
                <span v-if="updating" class="spinner-border spinner-border-sm" role="status"></span>
                Guardar cambios
              </button>
            </form>

            <div v-else class="row">
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ phoneNumber }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sección Domicilio -->
          <div class="profile-section">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="section-title">Domicilio</h3>
              <button @click="toggleEditMode('address')" class="btn btn-sm btn-outline-primary">
                {{ editMode.address ? 'Cancelar' : 'Editar' }}
              </button>
            </div>

            <form v-if="editMode.address" @submit.prevent="updateAddressInfo" class="mt-3">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Dirección</label>
                  <input v-model="editForm.domicilio" type="text" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Tipo de domicilio</label>
                  <select v-model="editForm.tipo_domicilio_id" class="form-select" required>
                    <option v-for="address in addressTypes" :key="address.id" :value="address.id">
                      {{ address.descripcion }}
                    </option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="updating">
                <span v-if="updating" class="spinner-border spinner-border-sm" role="status"></span>
                Guardar cambios
              </button>
            </form>

            <div v-else class="row">
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Dirección:</span>
                  <span class="info-value">
                    {{ userData.persona.domicilio.detalle }}
                  </span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <span class="info-label">Tipo:</span>
                  <span class="info-value">
                    {{ userData.persona.domicilio.tipo_domicilio.descripcion }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>



<style scoped>
.profile-container {
  /*max-width: 800px;*/
  margin: 2rem;
  padding: 0 15px;
  width: 100%;
}

.profile-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
}

.profile-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.profile-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-weight: 600;
  color: #555;
  display: block;
  margin-bottom: 0.25rem;
}

.info-value {
  color: #333;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .profile-container {
    margin: 1rem auto;
  }
  
  .card-header h2 {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .info-value {
    font-size: 1rem;
  }
}

.spinner-border {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

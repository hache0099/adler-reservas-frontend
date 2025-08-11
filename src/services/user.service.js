import axios from 'axios';
import authHeader from './auth-header'; 

const API_URL = 'http://localhost:9000/api/v1';

const USER_ID = localStorage.getItem('userId');

class UserService {
  // Obtener perfil del usuario logueado
  getProfile() {
    console.log(`Llamando a ${API_URL}/user/${USER_ID}`);
    return axios.get(`${API_URL}/user/${USER_ID}`, { 
      headers: authHeader() 
    }).then(response => {
      console.log("getProfile:", response.data);
      return response.data;
    });
  }

  // Actualizar datos personales
  updateProfile(profileData) {
    console.log('Actualizando datos:', profileData);
    return axios.put(`${API_URL}/user/${USER_ID}`, profileData, { 
      headers: authHeader() 
    }).then(response => {
      return response.data;
    });
  }

  // Actualizar email
  updateEmail(newEmail) {
    return axios.put(`${API_URL}/user/email`, { email: newEmail }, { 
      headers: authHeader() 
    }).then(response => {
      return response.data;
    });
  }

  // Actualizar contraseña
  updatePassword(id, currentPassword, newPassword) {
    return axios.put(`${API_URL}/change-password`, {
      id: id,
      currentPassword: currentPassword,
      newPassword: newPassword
    }, { 
      headers: authHeader() 
    }).then(response => {
      return response.data;
    });
  }

  // Obtener documentos (para formularios de edición)
  getDocumentTypes() {
    return axios.get(`${API_URL}/gestion/tipos-documento`, { 
      headers: authHeader() 
    }).then(response => {
      return response.data;
    });
  }

  // Obtener tipos de domicilio (para formularios de edición)
  getAddressTypes() {
    return axios.get(`${API_URL}/gestion/tipos-domicilio`, { 
      headers: authHeader() 
    }).then(response => {
      return response.data;
    });
  }

  // Obtener tipos de contacto (para formularios de edición)
  getContactTypes() {
    return axios.get(`${API_URL}/gestion/tipos-contacto`, { 
      headers: authHeader() 
    }).then(response => {
      return response.data;
    });
  }

  // Manejo de errores centralizado
  handleError(error) {
    let errorMessage = 'Ocurrió un error';
    
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 401) {
        errorMessage = 'No autorizado - por favor inicie sesión nuevamente';
      } else if (error.response.status === 403) {
        errorMessage = 'No tiene permisos para esta acción';
      } else if (error.response.status === 404) {
        errorMessage = 'Recurso no encontrado';
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      errorMessage = 'No se pudo conectar con el servidor';
    }
    
    console.error('Error en UserService:', errorMessage);
    throw new Error(errorMessage);
  }
}

// Exportamos una instancia del servicio
export default new UserService();

import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:9000/api/v1';

export default {
  login(email, password) {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
  },

  storeUserData(data){
    localStorage.setItem('userToken', response.data.token); // Guarda el token
    localStorage.setItem('userId', response.data.user.id); //guarda la info de usuario
    localStorage.setItem('userEmail', response.data.user.email);
    localStorage.setItem('userPerfil', response.data.user.perfil_id);
  },
  
  // Nueva función para verificar email
  checkEmail(email) {
    return axios.post(`${API_URL}/auth/check-email`, { email });
  },

  // Nueva función para obtener tipos de documento
  getDocumentTypes() {
    return axios.get(`${API_URL}/auth/get-tipo-documento`);
  },

  // Función para registro
  register(userData) {
    return axios.post(`${API_URL}/auth/register`, userData);
  },
  
  logout() {
    // Elimina los datos del usuario del localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');
    
    // Opcional: Enviar solicitud al backend para invalidar el token
    return axios.post(`${API_URL}/logout`, {}, {
      headers: authHeader()
    }).catch(error => {
      console.error('Error al cerrar sesión en el backend:', error);
      // Aún así continuamos con el logout aunque falle la llamada al backend
    });
  }
};

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
    localStorage.setItem('userToken', data.token); // Guarda el token
    localStorage.setItem('userId', data.user.id); //guarda la info de usuario
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userPerfil', data.user.perfil_id);
    localStorage.setItem('nombre', data.user.persona.nombre);
    localStorage.setItem('apellido', data.user.persona.apellido);

    return true;
  },
  
  // Nueva función para verificar email
  async checkEmail(email) {
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
    const datosAEliminar = ['userToken', 'userId', 'userEmail', 'userPerfil', 'nombre', 'apellido'];
    
    // Enviar solicitud al backend para invalidar el token
    axios.post(`${API_URL}/auth/logout`, {}, {
      headers: authHeader()
    })   
    .catch(error => {
      console.error('Error al cerrar sesión en el backend:', error);
      // Aún así continuamos con el logout aunque falle la llamada al backend
    })
    .finally(() => {
      for(let dato of datosAEliminar){
        localStorage.removeItem(dato);
      }     
    });
  }
};

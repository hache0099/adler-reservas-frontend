import axios from 'axios';

const API_URL = 'http://localhost:9000/api/v1';

export default {
  login(email, password) {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
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
  }
};

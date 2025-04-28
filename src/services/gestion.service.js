import axios from 'axios';
import authHeader from './auth-header'; 

const API_URL = 'http://localhost:9000/api/v1';

class GestionService {
  getModulos(){
    return axios.get(`${API_URL}/gestion/get-modulos`, {
      headers: authHeader()
    }).then(response => {
      return response.data
    })
  }
}

export default new GestionService();

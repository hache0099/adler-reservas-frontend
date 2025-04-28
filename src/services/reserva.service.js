import axios from 'axios';
import authHeader from './auth-header'; 

const API_URL = 'http://localhost:9000/api/v1';

const USER_ID = localStorage.getItem('userId');

class ReservaService {
  getReservasPendientes() {
    return axios.get(`${API_URL}/reservas/${USER_ID}/get-pendientes`, {
      headers: authHeader()
    }).then(response => {
      return response.data
    })
  }

  getCanchasDisponibles(fecha, hora){
    return axios.get(`${API_URL}/reservas/get-canchas-disponibles`, {
      headers: authHeader(),
      params: {
        fecha: fecha,
        hora: hora 
      }
    }).then(response => {
      return response.data
    })
  }

  createReserva(fecha, hora, cancha, userId){
    const data = {
      fecha: fecha,
      hora: hora,
      cancha: cancha,
      user: parseInt(userId), 
    }
    return axios.post(`${API_URL}/reservas/reserva`, data,{
      headers: authHeader(),
    }).then(response => {
      return response.data
    })
  }
}

export default new ReservaService();

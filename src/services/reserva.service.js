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

  getTodasReservas() {
    return axios.get(`${API_URL}/reservas/${USER_ID}/get-all-reservas`, {
      headers: authHeader()
    }).then(response => {
      return response.data
    })
  }

  async getCanchasDisponibles(fecha, hora){
    try {
      const res = await axios.get(`${API_URL}/reservas/get-canchas-disponibles`, {
        headers: authHeader(),
        params: { fecha, hora }
      });
      return res.data;
    } catch (error) {
      console.error('Error al obtener canchas disponibles:', error);
      return [];
    }
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

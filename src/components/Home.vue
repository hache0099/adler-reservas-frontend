<template>
  <div id="home-body">
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img :src="assets.logo" alt="ADLER Reservas">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item" v-for="(item, index) in navItems" :key="index">
                <a class="nav-link active" :href="item.link">{{ item.text }}</a>
              </li>
            </ul>
            <div class="d-flex w-50 justify-content-end">
              <router-link to="/register" class="nav-link">Registrarse</router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <!-- Sección Introducción -->
      <section id="intro">
        <div class="video-container">
          <video height="650" class="background-video hidden-sm-down" autoplay loop muted>
            <source :src="assets.videoBg" type="video/webm">
          </video>
          <div class="overlay">
            <h1 class="text">⚽ ¡Juega donde la pasión se siente! 🌟</h1>
            <br>
            <h2>Reservá tu cancha ahora y disfrutá del mejor fútbol 5 con tus amigos</h2>
          </div>
        </div>
      </section>

      <!-- Sección Beneficios -->
      <section id="beneficios">
        <div class="container mb-5">
          <div class="row d-flex">
            <div class="row mt-5 mb-4">
              <h2 class="text-center">Los beneficios que vas a encontrar</h2>
            </div>
            <div class="row mb-5 justify-content-center">
              <div class="col fade-delay" v-for="(benefit, index) in benefits" :key="'benefit-'+index">
                <div class="card beneficio-card">
                  <img :src="benefit.image" class="card-img-top beneficio-img">
                  <div class="card-body">
                    <h3 class="card-title">{{ benefit.title }}</h3>
                    <p class="card-text">{{ benefit.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección Canchas -->
      <section id="canchas" class="mt-5">
        <div class="container">
          <div class="row mb-4">
            <div class="col text-center mx-5">
              <h2>Juegue en nuestras mejores canchas</h2>
            </div>
          </div>
          
          <div class="row align-items-center mb-4 fade" v-for="(field, index) in fields" :key="'field-'+index" 
               :class="{'order-md-2': index % 2 === 0, 'order-md-1': index % 2 !== 0}">
            <div class="col-md-6" :class="{'order-md-2': index % 2 === 0}">
              <img :src="field.image" :alt="field.name" class="img-fluid rounded">
            </div>
            <div class="col-md-6" :class="{'order-md-1': index % 2 === 0}">
              <h3>{{ field.name }}</h3>
              <p>{{ field.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-dark">
      <div class="d-flex justify-content-between align-items-center py-3 px-5 my-4 border-top bg-dark" data-bs-theme="dark">
        <div class="col-md-4 px-5 d-flex align-items-center">
          <span class="mb-3 mb-md-0 text-body-secondary">&copy; 2024 FALKe Software</span>
        </div>
        <ul class="nav col-md-4 px-5 justify-content-end list-unstyled d-flex">
          <li class="ms-3" v-for="(social, index) in socialMedia" :key="'social-'+index">
            <a class="text-body-secondary" :href="social.link" target="_blank">
              <i :class="'fa fa-' + social.icon"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import logo from '../assets/img/logo.png';
import videoBg from '../assets/img/football_clip_small.webm';
import benefit1 from '../assets/img/beneficios/sistema-reservas-horas_min.png';
import benefit2 from '../assets/img/beneficios/notificaciones.png';
import benefit3 from '../assets/img/beneficios/socios.png';
import field1 from '../assets/img/canchas/cancha_1.jpg';
import field2 from '../assets/img/canchas/cancha_2.jpg';
import field3 from '../assets/img/canchas/cancha_3.jpg';
import splashBg from '../assets/img/spalsh.png';

export default {
  name: 'HomePage',
  data() {
    return {
      assets: {
        logo,
        videoBg,
        benefit1,
        benefit2,
        benefit3,
        field1,
        field2,
        field3,
        splashBg
      },
      navItems: [
        { text: 'Home', link: '#' },
        { text: 'Quiénes somos', link: '#' },
        { text: 'Precios', link: '#' },
        { text: 'Horarios', link: '#' },
        { text: 'Contáctanos', link: '#' }
      ],
      benefits: [
        {
          image: benefit1,
          title: 'Reservas online',
          description: 'Reservá tu cancha en minutos, desde cualquier lugar y en cualquier momento.'
        },
        {
          image: benefit2,
          title: 'Notificaciones',
          description: 'Recibí alertas sobre tus reservas y recordatorios para que no te pierdas el partido.'
        },
        {
          image: benefit3,
          title: 'Membresías',
          description: 'Accedé a beneficios exclusivos y descuentos por ser parte de nuestra comunidad.'
        }
      ],
      fields: [
        {
          image: field1,
          name: 'Cancha Cesped',
          description: 'Experimente la sensación de jugar en una cancha de césped premium diseñada para brindar la máxima comodidad y tracción en cada movimiento.'
        },
        {
          image: field2,
          name: 'Cancha Arena',
          description: 'Disfrute de una experiencia única en nuestra cancha de arena, perfecta para deportes de playa y entrenamientos al aire libre.'
        },
        {
          image: field3,
          name: 'Cancha Piso',
          description: 'Juegue al máximo nivel en nuestra cancha de piso duro, ideal para deportes rápidos que requieren precisión y velocidad.'
        }
      ],
      socialMedia: [
        { icon: 'facebook', link: 'https://facebook.com' },
        { icon: 'instagram', link: 'https://instagram.com' },
        { icon: 'twitter', link: 'https://twitter.com' }
      ]
    }
  },
  mounted() {
    this.initAnimations();
  },
  methods: {
    initAnimations() {
      const elements = document.querySelectorAll(".fade, .fade-delay");

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              if (entry.target.classList.contains("fade-delay")) {
                entry.target.style.setProperty("--fade-delay", `${index * 0.3}s`);
              }
              entry.target.classList.add("active");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.45 }
      );

      elements.forEach(element => observer.observe(element));
    }
  }
}
</script>

<style scoped>
/* GLOBALES Y ANIMACIONES */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&display=swap');

@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.fade, .fade-delay {
  opacity: 0;
  transform: translateY(30px);
  animation: fade-up 1s ease-out forwards;
  animation-play-state: paused;
  animation-delay: var(--fade-delay, 0s);
}

.fade.active, .fade-delay.active {
  animation-play-state: running;
}

.container-full-height {
  height: 100vh;
  align-items: center;
  justify-content: center;
}

#home-body {
  background-image: url('../assets/img/spalsh.png');
  font-family: "Oswald";
}

main {
  font-size: x-large;
}

h2 {
  color: white;
}

/* NAVBAR */
.icon {
  font-size: 24px;
  color: white;
  margin-right: 5px;
  margin-left: 5px;
}

.navbar-brand img {
  max-height: 50px;
}

.navbar {
  font-size: larger;
}

.navbar a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  display: inline-block;
  border-bottom: 2px solid transparent;
}

/* SECCION INTRODUCCION */
.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(7px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.text {
  color: white;
  font-size: 2rem;
  text-align: center;
  z-index: 3;
}

.overlay h2 {
  color: white;
  font-size: 1.75rem;
  margin-top: 0.5rem;
  text-align: center;
}

/* SECCION CANCHAS */
.canchas-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  gap: 20px;
  flex-wrap: wrap;
}

.cancha-card {
  position: relative;
  width: 300px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cancha-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cancha-name {
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.descripcion {
  width: 35rem;
}

#canchas h3, #canchas p {
  color: white;
}

#canchas p {
  font-size: larger;
}

/* SECCION BENEFICIOS */
.beneficio-card {
  width: 18rem;
}

.beneficio-img {
  max-height: 200px;
  max-width: 700px;
  object-fit: cover;
}
</style>

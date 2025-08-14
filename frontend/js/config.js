const dev = window.location.hostname === 'localhost';
export const API_URL = dev
  ? 'http://localhost:5000/api'
  : 'https://solare-catalogo-hukk.onrender.com/api';
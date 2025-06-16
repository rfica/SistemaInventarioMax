// src/services/apiService.js

// Importa tu configuración de API real (ej. axios, fetch, etc.)
// import axios from 'axios'; // Ejemplo

// Importa tu servicio mockeado
import * as mockApi from '../mock/apiMock';

// Verifica la variable de entorno
const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true';

// Define tus funciones de API real
// const getItemsReal = async () => {
//   const response = await axios.get('/api/items');
//   return response.data;
// };

// const getUserDetailsReal = async () => {
//   const response = await axios.get('/api/user');
//   return response.data;
// };

// Define funciones placeholder para la API real si aún no existen
// En un escenario real, aquí tendrías tus implementaciones de llamada a la API
const loginReal = async (credentials) => {
  console.warn("Using placeholder loginReal. Implement real API call.");
  // Simula una respuesta de error por defecto si la implementación real no está lista
  throw new Error("Real login API not implemented.");
};

const getUserDetailsFromTokenReal = async (token) => {
  console.warn("Using placeholder getUserDetailsFromTokenReal. Implement real API call.");
  // Simula una respuesta de error por defecto
   throw new Error("Real getUserDetailsFromToken API not implemented.");
};

// ... define tus otras funciones de API real aquí

// Construye el objeto 'api' que se exportará, incluyendo condicionalmente mocks o reales
const api = {
  login: useMockApi ? mockApi.login : loginReal,
  getUserDetailsFromToken: useMockApi ? mockApi.getUserDetailsFromToken : getUserDetailsFromTokenReal,
  // Incluye otras funciones mockeadas aquí si son necesarias para otras partes de la app
  // Ejemplo: si getItems existe en mockApi y necesitas usarlo
  getItems: useMockApi ? mockApi.getItems : null,
  // Ejemplo: si getUserDetails existe en mockApi y necesitas usarlo
  getUserDetails: useMockApi ? mockApi.getUserDetails : null,
  // Añadidas para mockear /api/movements y /api/products
  getMovements: useMockApi ? mockApi.getMovements : null, // Reemplazar con getMovementsReal
  getProducts: useMockApi ? mockApi.getProducts : null, // Reemplazar con getProductsReal
};

export default api;
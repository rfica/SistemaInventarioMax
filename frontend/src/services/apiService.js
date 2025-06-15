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

// ... define tus otras funciones de API real aquí

// Exporta las funciones condicionalmente
let api;

if (useMockApi) {
  api = mockApi;
} else {
  api = {
    // getItems: getItemsReal, // Descomenta y usa tus funciones reales aquí
    // getUserDetails: getUserDetailsReal, // Descomenta y usa tus funciones reales aquí
    // ... exporta tus otras funciones reales aquí
  };
  // Si tu servicio real exporta directamente las funciones,
  // podrías simplemente tener un export como este:
  // export const getItems = getItemsReal;
  // export const getUserDetails = getUserDetailsReal;
  // ... y necesitarías envolver esas exportaciones en la lógica condicional.
  // Una forma más limpia es exportar un objeto 'api' como en el ejemplo 'mockApi'.
}

export default api; // Exporta el objeto 'api' que contiene las funciones (mock o real)

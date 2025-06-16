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

const getProductsReal = async () => {
  console.warn("Using placeholder getProductsReal. Implement real API call.");
  throw new Error("Real getProducts API not implemented.");
};

const getMovementsReal = async () => {
  console.warn("Using placeholder getMovementsReal. Implement real API call.");
  throw new Error("Real getMovements API not implemented.");
};

const getCategoriesReal = async () => {
  console.warn("Using placeholder getCategoriesReal. Implement real API call.");
  throw new Error("Real getCategories API not implemented.");
};

const getWarehousesReal = async () => {
  console.warn("Using placeholder getWarehousesReal. Implement real API call.");
  throw new Error("Real getWarehouses API not implemented.");
};

const createProductReal = async (productData) => {
  console.warn("Using placeholder createProductReal. Implement real API call.");
  throw new Error("Real createProduct API not implemented.");
};

const updateProductReal = async (productId, productData) => {
  console.warn("Using placeholder updateProductReal. Implement real API call.");
  throw new Error("Real updateProduct API not implemented.");
};

const deleteProductReal = async (productId) => {
  console.warn("Using placeholder deleteProductReal. Implement real API call.");
  throw new Error("Real deleteProduct API not implemented.");
};

const createMovementReal = async (movementData) => {
  console.warn("Using placeholder createMovementReal. Implement real API call.");
  throw new Error("Real createMovement API not implemented.");
};

// Placeholder functions for Category API calls (add real implementation when available)
const createCategoryReal = async (categoryData) => {
    console.warn("Using placeholder createCategoryReal. Implement real API call.");
    throw new Error("Real createCategory API not implemented.");
};

 // Placeholder functions for Category API calls (add real implementation when available)
const updateCategoryReal = async (categoryId, categoryData) => {
    console.warn("Using placeholder updateCategoryReal. Implement real API call.");
    throw new Error("Real updateCategory API not implemented.");
};

 // Placeholder functions for Category API calls (add real implementation when available)
const deleteCategoryReal = async (categoryId) => {
    console.warn("Using placeholder deleteCategoryReal. Implement real API call.");
    throw new Error("Real deleteCategory API not implemented.");
};

// Construye el objeto 'api' que se exportará, incluyendo condicionalmente mocks o reales
const api = {
  login: useMockApi ? mockApi.login : loginReal,
  getUserDetailsFromToken: useMockApi ? mockApi.getUserDetailsFromToken : getUserDetailsFromTokenReal,
  // Incluye otras funciones mockeadas aquí si son necesarias para otras partes de la app
  getItems: useMockApi ? mockApi.getItems : null, // Puedes reemplazar 'null' si tienes implementaciones reales
  getUserDetails: useMockApi ? mockApi.getUserDetails : null, // Puedes reemplazar 'null' si tienes implementaciones reales

  // Funciones de productos
  getProducts: useMockApi ? mockApi.getProducts : getProductsReal,
  createProduct: useMockApi ? mockApi.createProduct : createProductReal,
  updateProduct: useMockApi ? mockApi.updateProduct : updateProductReal,
  deleteProduct: useMockApi ? mockApi.deleteProduct : deleteProductReal,

  // Funciones de movimientos
  getMovements: useMockApi ? mockApi.getMovements : getMovementsReal,
  createMovement: useMockApi ? mockApi.createMovement : createMovementReal,

  // Funciones de categorías
  getCategories: useMockApi ? mockApi.getCategories : getCategoriesReal,
  createCategory: useMockApi ? mockApi.createCategory : createCategoryReal,
  updateCategory: useMockApi ? mockApi.updateCategory : updateCategoryReal,
  deleteCategory: useMockApi ? mockApi.deleteCategory : deleteCategoryReal,

  // Funciones de almacenes (Aún no revisamos Warehouses.js, pero las añadimos aquí)
  getWarehouses: useMockApi ? mockApi.getWarehouses : getWarehousesReal,
  // Agrega createWarehouse, updateWarehouse, deleteWarehouse aquí cuando implementes esas páginas
};

console.log("apiService - useMockApi:", useMockApi);
console.log("apiService - exported api object:", api);

export default api;
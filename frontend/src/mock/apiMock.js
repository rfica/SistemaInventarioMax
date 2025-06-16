// src/services/mock/apiMock.js

export const mockItems = [
    {
      id: 'item-1',
      name: 'Mock Item 1',
      description: 'This is a description for mock item 1.',
      status: 'active',
      price: 19.99
    },
    {
      id: 'item-2',
      name: 'Mock Item 2',
      description: 'This is a description for mock item 2.',
      status: 'inactive',
      price: 29.50
    },
    // Añade aquí más datos mockeados según las necesidades de tus pantallas
  ];

export const mockCategories = [
  { id: 'cat-1', nombre: 'Electronics' },
  { id: 'cat-2', nombre: 'Furniture' },
];

export const mockWarehouses = [
  { id: 'ware-1', nombre: 'Main Warehouse' },
  { id: 'ware-2', nombre: 'Branch Stock' },
];


  
  export const mockUserDetails = {
    id: 'user-123',
    username: 'mockuser',
    email: 'mockuser@example.com',
    // Añade otros campos que tu aplicación espere recibir del usuario autenticado
    role: 'admin'
  };
  
  // Simula una pequeña latencia de red
  const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const getItems = async () => {
    await simulateDelay(500); // Simula medio segundo de latencia
    return mockItems;
  };
  
  export const getUserDetails = async () => {
    await simulateDelay(300); // Simula 300ms de latencia
    return mockUserDetails;
  };
  
// Mock data for movements
export const mockMovements = [
  // Add mock movement objects here
];

// Mock data for products
export const mockProducts = [
  // Add mock product objects here
];

// Simulate fetching movements
export const getMovements = async () => {
  await simulateDelay(300); // Simulate latency
  return { data: mockMovements };
};

// Simulate fetching products
export const getProducts = async () => {
  await simulateDelay(300);
 return { data: mockProducts };
};

export const getCategories = async () => {
  await simulateDelay(300);
  return { data: mockCategories };
};

export const getWarehouses = async () => {
  await simulateDelay(300);
  return { data: mockWarehouses };
};

// Simulate creating a product
export const createProduct = async (productData) => {
  await simulateDelay(400);
  // In a real mock, you might add the product to a mock array and return it.
  // For now, simulate a successful creation response.
  const newProduct = { id: `prod-${Date.now()}`, ...productData };
  // mockProducts.push(newProduct); // Optional: add to a mock data array
  return { data: newProduct };
};

// Simulate updating a product
export const updateProduct = async (productId, productData) => {
  await simulateDelay(400);
  // Simulate a successful update response
  return { data: { id: productId, ...productData } };
};

// Simulate deleting a product
export const deleteProduct = async (productId) => {
  await simulateDelay(300);
  return { data: { id: productId, success: true } };
};

  // Simula el inicio de sesión
  export const login = async (credentials) => {
    await simulateDelay(400); // Simula latencia para el inicio de sesión
    // Aquí podrías añadir lógica para verificar las credenciales mockeadas
    // Por ahora, simplemente devolvemos un token mockeado
    return { token: 'mock-jwt-token-12345', role: 'admin' }; 
  };
  
  // Simula la obtención de los detalles del usuario después del inicio de sesión
  export const getUserDetailsFromToken = async (token) => {
    await simulateDelay(300); // Simula latencia
    // En un escenario real, verificarías el token. Aquí, simplemente devolvemos los detalles mockeados.
    return mockUserDetails;
  };
  // Nota: La función getUserDetails ya existe y devuelve mockUserDetails,
  // pero getUserDetailsFromToken es para simular la llamada específica post-login.
  // Añade aquí funciones mockeadas para otras llamadas a la API que necesites simular
  // Asegúrate de que los nombres de las funciones coincidan con las de tu servicio de API real.
  
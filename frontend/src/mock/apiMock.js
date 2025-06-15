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
  
  export const mockUserDetails = {
    id: 'user-123',
    username: 'mockuser',
    email: 'mockuser@example.com',
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
  
  // Añade aquí funciones mockeadas para otras llamadas a la API que necesites simular
  // Asegúrate de que los nombres de las funciones coincidan con las de tu servicio de API real.
  
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
// More detailed mock categories
export const mockCategories = [
  { id: 'cat-1', nombre: 'Electronics', descripcion: 'Gadgets and electronic devices' },
  { id: 'cat-2', nombre: 'Furniture', descripcion: 'Home and office furniture' },
  { id: 'cat-3', nombre: 'Books', descripcion: 'Printed and digital reading material' },
];

// More detailed mock warehouses
export const mockWarehouses = [
  { id: 'ware-1', nombre: 'Main Warehouse', ubicacion: '123 Industrial Rd', descripcion: 'Primary storage facility' },
  { id: 'ware-2', nombre: 'Branch Stock', ubicacion: '456 Downtown St', descripcion: 'Secondary storage location' },
  { id: 'ware-3', nombre: 'Online Fulfillment', ubicacion: '789 Web Ave', descripcion: 'Dedicated to online orders' },
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
  {
    id: 'mov-1',
    tipo: 'entrada',
    fecha: '2023-10-26T10:00:00Z',
    referencia: 'REF-ENT-001',
    User: { username: 'mockuser' }, // User details expected by the table
    MovementDetails: [
      {
        id: 'movdet-1-1',
        cantidad: 10,
        Producto: { nombre: 'Mock Item 1' }, // Product details expected by the table
        Almacen: { nombre: 'Main Warehouse' }, // Warehouse details expected by the table
      },
      {
        id: 'movdet-1-2',
        cantidad: 5,
        Producto: { nombre: 'Mock Item 2' },
        Almacen: { nombre: 'Branch Stock' },
      },
    ],
  },
  {
    id: 'mov-2',
    tipo: 'Salida', // Ensure consistent casing
    fecha: '2023-10-26T11:30:00Z',
    referencia: 'REF-SAL-001',
    User: { username: 'anotheruser' },
    MovementDetails: [
      {
        id: 'movdet-2-1',
        cantidad: 3, // Quantity moved
        Producto: { nombre: 'Mock Item 1' },
        Almacen: { nombre: 'Main Warehouse' },
      },
    ],
  },
    {
    id: 'mov-3',
 tipo: 'Entrada', // Ensure consistent casing
    fecha: '2023-10-27T09:00:00Z',
    referencia: 'REF-ENT-002',
    User: { username: 'mockuser' },
    MovementDetails: [
      {
        id: 'movdet-3-1',
 cantidad: 20, // Quantity moved
 Producto: { nombre: 'Mock Product 3' },
 Almacen: { nombre: 'Online Fulfillment' },
      },
    ],
  },
    {
    id: 'mov-4',
 tipo: 'Salida', // Ensure consistent casing
    fecha: '2023-10-27T14:00:00Z',
    referencia: 'REF-SAL-002',
    User: { username: 'anotheruser' },
    MovementDetails: [
      {
        id: 'movdet-4-1',
 cantidad: 5, // Quantity moved
 Producto: { nombre: 'Mock Product 2' },
 Almacen: { nombre: 'Branch Stock' },
      },
            {
        id: 'movdet-4-2',
 cantidad: 2, // Quantity moved
        Producto: { nombre: 'Mock Product 3' },
 Almacen: { nombre: 'Online Fulfillment' },
      },

    ],
  },
];

// More detailed mock products
export const mockProducts = [
  {
    id: 'prod-1',
    nombre: 'Laptop MockBook',
    cantidad: 50,
    precio: 1200.00,
    stock_minimo: 10,
    categoria_id: 'cat-1', // Link to mock category
    almacen_id: 'ware-1', // Link to mock warehouse
    Category: { nombre: 'Electronics' }, // Nested data expected by Products page
    Warehouse: { nombre: 'Main Warehouse' }, // Nested data expected by Products page
  },
  {
    id: 'prod-2',
    nombre: 'Office Chair Pro',
    cantidad: 15,
    precio: 250.00,
    stock_minimo: 5,
    categoria_id: 'cat-2', // Link to mock category
    almacen_id: 'ware-2', // Link to mock warehouse
    Category: { nombre: 'Furniture' },
    Warehouse: { nombre: 'Branch Stock' },
  },
  {
    id: 'prod-3',
    nombre: 'The Mocked Novel',
    cantidad: 5, // Low stock example
    precio: 15.00,
    stock_minimo: 10,
    categoria_id: 'cat-3', // Link to mock category
    almacen_id: 'ware-3', // Link to mock warehouse
    Category: { nombre: 'Books' },
    Warehouse: { nombre: 'Online Fulfillment' },
  },
];

// Simulate fetching movements - Ensure this uses the updated mockMovements
export const getMovements = async () => {
  await simulateDelay(300); // Simulate latency
  return { data: mockMovements };
};

// Simulate fetching products - Ensure this uses the updated mockProducts
export const getProducts = async () => {
  await simulateDelay(300);
 return { data: mockProducts };
};

// Simulate fetching categories - Ensure this uses the updated mockCategories
export const getCategories = async () => {
  await simulateDelay(300);
  return { data: mockCategories };
};

// Simulate fetching warehouses - Ensure this uses the updated mockWarehouses
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
  // Optional: Add the new product to mockProducts array for persistence during the session
  mockProducts.push({...newProduct,
    Category: mockCategories.find(cat => cat.id === newProduct.categoria_id) || { nombre: 'Unknown' },
    Warehouse: mockWarehouses.find(ware => ware.id === newProduct.almacen_id) || { nombre: 'Unknown' },
  });
 return { data: newProduct };
};

// Simulate updating a product
export const updateProduct = async (productId, productData) => {
  await simulateDelay(400);
  // Find the product in the mock array and update it (for persistence)
  const index = mockProducts.findIndex(p => p.id === productId);
  if (index !== -1) {
    mockProducts[index] = {
      ...mockProducts[index],
      ...productData,
      Category: mockCategories.find(cat => cat.id === productData.categoria_id) || { nombre: 'Unknown' },
      Warehouse: mockWarehouses.find(ware => ware.id === productData.almacen_id) || { nombre: 'Unknown' },
    };
 return { data: mockProducts[index] };
  }
  // Simulate a successful update response if not found in mock array
 return { data: { id: productId, ...productData } };
};

// Simulate deleting a product
export const deleteProduct = async (productId) => {
  await simulateDelay(300);
  // Remove the product from the mock array (for persistence)
  const initialLength = mockProducts.length;
  mockProducts = mockProducts.filter(p => p.id !== productId);
  return { data: { id: productId, success: mockProducts.length < initialLength } }; // Indicate success if length changed
};

// Simulate creating a category
export const createCategory = async (categoryData) => {
  await simulateDelay(400);
  const newCategory = { id: `cat-${Date.now()}`, ...categoryData };
  // Add to mockCategories for persistence
  mockCategories.push(newCategory);
 return { data: newCategory };
};

// Simulate updating a category
export const updateCategory = async (categoryId, categoryData) => {
  await simulateDelay(400);
  // Find and update in mockCategories for persistence
  const index = mockCategories.findIndex(c => c.id === categoryId);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...categoryData };
 return { data: mockCategories[index] };
  }
  // Simulate a successful update response if not found
 return { data: { id: categoryId, ...categoryData } };
};

// Simulate deleting a category
export const deleteCategory = async (categoryId) => {
  await simulateDelay(300);
  // Remove from mockCategories for persistence
  const initialLength = mockCategories.length;
  mockCategories = mockCategories.filter(c => c.id !== categoryId);
  return { data: { id: categoryId, success: mockCategories.length < initialLength } };
};

// Simulate creating a warehouse
export const createWarehouse = async (warehouseData) => {
  await simulateDelay(400);
  const newWarehouse = { id: `ware-${Date.now()}`, ...warehouseData };
  // Add to mockWarehouses for persistence
  mockWarehouses.push(newWarehouse);
 return { data: newWarehouse };
};

// Simulate updating a warehouse
export const updateWarehouse = async (warehouseId, warehouseData) => {
  await simulateDelay(400);
  // Find and update in mockWarehouses for persistence
  const index = mockWarehouses.findIndex(w => w.id === warehouseId);
  if (index !== -1) {
    mockWarehouses[index] = { ...mockWarehouses[index], ...warehouseData };
 return { data: mockWarehouses[index] };
  }
  // Simulate a successful update response if not found
 return { data: { id: warehouseId, ...warehouseData } };
};

// Simulate deleting a warehouse
export const deleteWarehouse = async (warehouseId) => {
  await simulateDelay(300);
  // Remove from mockWarehouses for persistence
  const initialLength = mockWarehouses.length;
  mockWarehouses = mockWarehouses.filter(w => w.id !== warehouseId);
  return { data: { id: warehouseId, success: mockWarehouses.length < initialLength } };
};

// Simulate fetching a single warehouse by ID (potentially needed for product form if you load product for edit)
export const getWarehouseById = async (warehouseId) => {
  await simulateDelay(300);
  const warehouse = mockWarehouses.find(w => w.id === warehouseId);
  if (warehouse) {
    return { data: warehouse };
  } else {
    // Simulate error for not found, matching axios error structure if possible
 return Promise.reject({ response: { status: 404, data: { error: 'Warehouse not found' } } });
  }
};

// Simulate creating a movement
export const createMovement = async (movementData) => {
  await simulateDelay(400);
  const newMovement = {
    id: `mov-${Date.now()}`,
    fecha: new Date().toISOString(),
 ...movementData,
    User: mockUserDetails, // Assign the mock user
    MovementDetails: movementData.MovementDetails.map((detail, index) => ({
      id: `movdet-${Date.now()}-${index}`,
 ...detail,
      Producto: mockProducts.find(p => p.id === detail.producto_id) || { nombre: 'Unknown Product' },
      Almacen: mockWarehouses.find(w => w.id === detail.almacen_id) || { nombre: 'Unknown Warehouse' },
    })),
  };
  // Add to mockMovements for basic persistence during the session
  mockMovements.push(newMovement);
 return { data: newMovement };
};

 // Simulate fetching a single product by ID (potentially needed for movement details form)
export const getProductById = async (productId) => {
 await simulateDelay(300);
  const product = mockProducts.find(p => p.id === productId);
  if (product) {
 return { data: product };
  } else {
    // Simulate error for not found
 return Promise.reject({ response: { status: 404, data: { error: 'Product not found' } } });
  }
};

 // Simulate fetching a single category by ID (potentially needed for product form if you load product for edit)
export const getCategoryById = async (categoryId) => {
  await simulateDelay(300);
  const category = mockCategories.find(c => c.id === categoryId);
  if (category) {
 return { data: category };
  } else {
    // Simulate error for not found
 return Promise.reject({ response: { status: 404, data: { error: 'Category not found' } } });
  }
};

// simulate getting movement details for a movement (if needed separately)
export const getMovementDetails = async (movementId) => {
 await simulateDelay(300);
 const movement = mockMovements.find(m => m.id === movementId);
 if (movement) {
 return { data: movement.MovementDetails };
 } else {
 return Promise.reject({ response: { status: 404, data: { error: 'Movement not found' } } });
 }
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


        Almacen: { nombre: 'Main Warehouse' },
      },
    ],
  },
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

// Simulate creating a category
export const createCategory = async (categoryData) => {
  await simulateDelay(400);
  const newCategory = { id: `cat-${Date.now()}`, ...categoryData };
  // Puedes añadir lógica aquí para añadirla a mockCategories si quieres que persista durante la sesión
  return { data: newCategory };
};

// Simulate updating a category
export const updateCategory = async (categoryId, categoryData) => {
  await simulateDelay(400);
  // Simula una respuesta exitosa de actualización
  return { data: { id: categoryId, ...categoryData } };
};

// Simulate deleting a category
export const deleteCategory = async (categoryId) => {
  await simulateDelay(300);
  // Simula una respuesta exitosa de eliminación
  return { data: { id: categoryId, success: true } };
};

// Simulate creating a warehouse
export const createWarehouse = async (warehouseData) => {
  await simulateDelay(400);
  const newWarehouse = { id: `ware-${Date.now()}`, ...warehouseData };
  // Puedes añadir lógica aquí para añadirla a mockWarehouses si quieres que persista durante la sesión
  return { data: newWarehouse };
};

// Simulate updating a warehouse
export const updateWarehouse = async (warehouseId, warehouseData) => {
  await simulateDelay(400);
  return { data: { id: warehouseId, ...warehouseData } };
};

// Simulate deleting a warehouse
export const deleteWarehouse = async (warehouseId) => {
  await simulateDelay(300);
};

// Simulate fetching a single warehouse by ID (needed for product form if you load product for edit)
export const getWarehouseById = async (warehouseId) => {
  await simulateDelay(300);
  const warehouse = mockWarehouses.find(w => w.id === warehouseId);
  if (warehouse) {
    return { data: warehouse };
  } else {
    throw new Error('Warehouse not found'); // Simulate error for not found
  }
};

// Simulate creating a movement
export const createMovement = async (movementData) => {
  await simulateDelay(400);
  const newMovement = { id: `mov-${Date.now()}`, fecha: new Date().toISOString(), ...movementData };
  return { data: newMovement };
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
  
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { register, login } = require('../controllers/AuthController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/ProductController');
const { getMovements, createMovement } = require('../controllers/MovementController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/CategoryController');
const { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/WarehouseController');
const { generateInventoryReport, generateMovementReport } = require('../controllers/ReportController');
const path = require('path');
const fs = require('fs');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas de productos
router.get('/products', authenticate, getProducts);
router.post('/products', authenticate, authorize(['admin', 'editor']), createProduct);
router.put('/products/:id', authenticate, authorize(['admin', 'editor']), updateProduct);
router.delete('/products/:id', authenticate, authorize(['admin']), deleteProduct);

// Rutas de categorías
router.get('/categories', authenticate, getCategories);
router.post('/categories', authenticate, authorize(['admin']), createCategory);
router.put('/categories/:id', authenticate, authorize(['admin']), updateCategory);
router.delete('/categories/:id', authenticate, authorize(['admin']), deleteCategory);

// Rutas de almacenes
router.get('/warehouses', authenticate, getWarehouses);
router.post('/warehouses', authenticate, authorize(['admin']), createWarehouse);
router.put('/warehouses/:id', authenticate, authorize(['admin']), updateWarehouse);
router.delete('/warehouses/:id', authenticate, authorize(['admin']), deleteWarehouse);

// Rutas de movimientos
router.get('/movements', authenticate, getMovements);
router.post('/movements', authenticate, authorize(['admin', 'editor']), createMovement);

// Rutas de reportes
router.post('/reports/inventory', authenticate, authorize(['admin']), generateInventoryReport);
router.post('/reports/movements', authenticate, authorize(['admin']), generateMovementReport);
router.get('/reports/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, '..', '..', 'public', 'reports', filename);

  if (fs.existsSync(filepath)) {
    res.download(filepath, filename, (err) => {
      if (err) console.error(err);
      // Eliminar archivo temporal después de la descarga
      try { fs.unlinkSync(filepath); } catch (e) {}
    });
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

module.exports = router;
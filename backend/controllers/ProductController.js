const { Product, Category, Warehouse } = require('../models');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ['nombre'] },
        { model: Warehouse, attributes: ['nombre'] }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ['nombre'] },
        { model: Warehouse, attributes: ['nombre'] }
      ]
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
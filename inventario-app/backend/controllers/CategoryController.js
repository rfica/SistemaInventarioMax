const { Category } = require('../models');

const getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Category.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Categoría no encontrada' });
    const category = await Category.findByPk(id);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
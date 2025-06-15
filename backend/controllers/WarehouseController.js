const { Warehouse } = require('../models');

const getWarehouses = async (req, res) => {
  const warehouses = await Warehouse.findAll();
  res.json(warehouses);
};

const createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Warehouse.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Almacén no encontrado' });
    const warehouse = await Warehouse.findByPk(id);
    res.json(warehouse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Warehouse.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Almacén no encontrado' });
    res.json({ message: 'Almacén eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse };
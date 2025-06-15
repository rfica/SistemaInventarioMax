const { Movement, Product, Warehouse, Category, User, MovementDetail } = require('../models');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize'); // Import Op for date filtering

const generateInventoryReport = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Warehouse, attributes: ['nombre'] },
        { model: Category, attributes: ['nombre'] },
        {
          model: Movement,
          attributes: ['tipo', 'fecha', 'referencia'],
          include: [{ model: User, attributes: ['username'] }]
        }
      ]
    });

    // Formatear datos para CSV
    const csvData = products.map(p => ({
      id: p.id,
      codigo: p.codigo || 'N/A',
      nombre: p.nombre,
      categoria: p.Category?.nombre || 'Sin categoría',
      almacen: p.Warehouse?.nombre || 'Sin almacén',
      cantidad: p.cantidad,
      precio: p.precio,
      stock_minimo: p.stock_minimo,
      ultimo_movimiento: p.Movements?.[0]?.fecha || 'N/A',
      tipo_ultimo_mov: p.Movements?.[0]?.tipo || 'N/A'
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Guardar archivo temporal
    const timestamp = Date.now();
    const filename = `reporte_inventario_${timestamp}.csv`;
    const filepath = path.join(__dirname, '..', '..', 'public', 'reports', filename);

    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    fs.writeFileSync(filepath, csv);

    res.json({
      url: `/api/reports/download/${filename}`,
      filename
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateMovementReport = async (req, res) => {
  try {
    const { tipo, fechaInicio, fechaFin } = req.query;
    const where = {};

    if (tipo) where.tipo = tipo;
    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    const movements = await Movement.findAll({
      where,
      include: [
        { model: User, attributes: ['username'] },
        {
          model: MovementDetail,
          include: [{ model: Product, attributes: ['nombre', 'codigo'] }]
        }
      ],
      order: [['fecha', 'DESC']]
    });

    // Formatear datos para CSV
    const csvData = movements.map(m => ({
      id: m.id,
      tipo: m.tipo,
      fecha: m.fecha,
      referencia: m.referencia || 'N/A',
      usuario: m.User?.username || 'N/A',
      productos: m.MovementDetails?.map(d =>
        `${d.Product?.nombre} (${d.cantidad})`
      ).join(', '),
      total: m.MovementDetails?.reduce((sum, d) => sum + (d.cantidad * d.costo_unitario), 0) || 0
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Guardar archivo temporal
    const timestamp = Date.now();
    const filename = `reporte_movimientos_${timestamp}.csv`;
    const filepath = path.join(__dirname, '..', '..', 'public', 'reports', filename);

    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    fs.writeFileSync(filepath, csv);

    res.json({
      url: `/api/reports/download/${filename}`,
      filename
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateInventoryReport, generateMovementReport };
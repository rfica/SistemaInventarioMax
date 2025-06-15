const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modelos
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'viewer'),
    defaultValue: 'viewer'
  }
});

const Category = sequelize.define('Category', {
  nombre: { type: DataTypes.STRING, allowNull: false }
});

const Warehouse = sequelize.define('Warehouse', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  ubicacion: DataTypes.STRING,
  descripcion: DataTypes.TEXT
});

const Product = sequelize.define('Product', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, defaultValue: 0 },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock_minimo: { type: DataTypes.INTEGER, defaultValue: 5 },
  codigo: { type: DataTypes.STRING, unique: true }
});

const Movement = sequelize.define('Movement', {
  tipo: {
    type: DataTypes.ENUM('entrada', 'salida', 'devolucion', 'ajuste', 'transferencia'),
    allowNull: false
  },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  notas: DataTypes.TEXT,
  referencia: DataTypes.STRING
});

const MovementDetail = sequelize.define('MovementDetail', {
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  costo_unitario: DataTypes.DECIMAL(10, 2)
});

// Relaciones
User.hasMany(Movement, { foreignKey: 'usuario_id' });
Movement.belongsTo(User, { foreignKey: 'usuario_id' });

Category.hasMany(Product, { foreignKey: 'categoria_id' });
Product.belongsTo(Category, { foreignKey: 'categoria_id' });

Warehouse.hasMany(Product, { foreignKey: 'almacen_id' });
Product.belongsTo(Warehouse, { foreignKey: 'almacen_id' });

Product.hasMany(MovementDetail, { foreignKey: 'producto_id' });
MovementDetail.belongsTo(Product, { foreignKey: 'producto_id' });

Movement.hasMany(MovementDetail, { foreignKey: 'movimiento_id' });
MovementDetail.belongsTo(Movement, { foreignKey: 'movimiento_id' });

module.exports = {
  User, Product, Category, Warehouse, Movement, MovementDetail
};
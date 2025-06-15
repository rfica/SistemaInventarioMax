const { Movement, MovementDetail, Product, User, Warehouse } = require('../models');
const { Op } = require('sequelize'); // Make sure Op is imported if used for date ranges
const sequelize = require('../config/db'); // Assuming sequelize instance is exported from db.js

const getMovements = async (req, res) => {
  try {
    const { tipo, fechaInicio, fechaFin, producto_id } = req.query;
    const where = {};

    if (tipo) where.tipo = tipo;
    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    // If filtering by product, you'd typically filter the MovementDetails
    // This current implementation fetches all movements and their details, then relies on frontend filtering
    // A more efficient approach for product filtering on the backend would require joining or a subquery.
    // For this example, we'll keep the current structure which loads all details.
    // If producto_id is present, the frontend will likely filter the details displayed.


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

    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMovement = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { tipo, notas, referencia, detalles } = req.body;

    if (!detalles || detalles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    const movement = await Movement.create({
      tipo,
      notas,
      referencia,
      usuario_id: req.user.id // Assuming req.user is populated by auth middleware
    }, { transaction });

    for (const detalle of detalles) {
      const product = await Product.findByPk(detalle.producto_id, { transaction });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: `Producto no encontrado` });
      }

      await MovementDetail.create({
        movimiento_id: movement.id,
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        costo_unitario: detalle.costo_unitario || product.precio // Use product price if cost not provided
      }, { transaction });

      // Actualizar stock según tipo de movimiento
      switch (tipo) {
        case 'entrada':
          product.cantidad += detalle.cantidad;
          break;
        case 'salida':
          if (product.cantidad < detalle.cantidad) {
            await transaction.rollback();
            return res.status(400).json({
              error: `Stock insuficiente para ${product.nombre}. Actual: ${product.cantidad}, Solicitado: ${detalle.cantidad}`
            });
          }
          product.cantidad -= detalle.cantidad;
          break;
        case 'devolucion':
          product.cantidad += detalle.cantidad;
          break;
        case 'ajuste':
          // Para ajustes, la cantidad puede ser positiva (agregar) o negativa (quitar)
          product.cantidad += detalle.cantidad;
          break;
        case 'transferencia':
          // Requires origin and destination
          if (!detalle.origen_id || !detalle.destino_id) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Transferencia requiere origen y destino' });
          }

          // Find the product instance at the origin warehouse
          const productAtOrigin = await Product.findOne({
            where: { id: detalle.producto_id, almacen_id: detalle.origen_id },
            transaction
          });

          if (!productAtOrigin) {
              await transaction.rollback();
              return res.status(404).json({ error: `Producto no encontrado en almacén de origen ${detalle.origen_id}` });
          }

          // Verify stock at origin
          if (productAtOrigin.cantidad < detalle.cantidad) {
            await transaction.rollback();
            return res.status(400).json({
              error: `Stock insuficiente en el almacén de origen (${productAtOrigin.Warehouse?.nombre || detalle.origen_id}) para ${product.nombre}`
            });
          }

          // Update stock at origin (decrease)
          productAtOrigin.cantidad -= detalle.cantidad;
          await productAtOrigin.save({ transaction });

          // Find or create the product instance at the destination warehouse
          let productAtDestination = await Product.findOne({
              where: { id: detalle.producto_id, almacen_id: detalle.destino_id },
              transaction
          });

          if (!productAtDestination) {
              // If the product doesn't exist at the destination, create it
              productAtDestination = await Product.create({
                  id: detalle.producto_id, // Use existing product ID
                  nombre: product.nombre,
                  precio: product.precio, // Or use a transfer cost if applicable
                  stock_minimo: product.stock_minimo,
                  codigo: product.codigo,
                  categoria_id: product.categoria_id,
                  almacen_id: detalle.destino_id,
                  cantidad: detalle.cantidad // Initial quantity is the transferred amount
              }, { transaction });
          } else {
              // If the product exists, update its quantity (increase)
              productAtDestination.cantidad += detalle.cantidad;
              await productAtDestination.save({ transaction });
          }

          // Note: The original Product instance `product` in the loop refers to the product in the context
          // where it was initially found (possibly the default warehouse if no warehouse was specified).
          // For transfers, we explicitly work with product instances tied to specific warehouses (origin/destination).
          // The `product.save()` call here is potentially ambiguous if the product instance isn't tied to a specific warehouse in a multi-warehouse setup.
          // A more robust approach for transfers might involve managing product quantities per warehouse directly in the Product model or a separate Inventory model.
          // For simplicity in this example, the updates are done on the specific product instances found by `findOne`.
          break;
      }

      // Save changes to the product (if it was an entry, exit, adjustment, or devolution impacting the originally fetched product)
      // For transfers, the saves happen within the transfer case using `productAtOrigin.save()` and `productAtDestination.save()`.
      if (tipo !== 'transferencia') {
         await product.save({ transaction });
      }

    }

    await transaction.commit();
    res.status(201).json(movement);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error al crear movimiento: ' + err.message });
  }
};


module.exports = { getMovements, createMovement };
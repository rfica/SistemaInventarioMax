const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inventario_db', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false // set to true to see SQL queries
});

// Optional: Authenticate and sync models on startup
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Example sync (use { alter: true } in development to update tables)
    // sequelize.sync({ alter: true });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
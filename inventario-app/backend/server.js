const express = require('express');
const sequelize = require('./config/db');
const routes = require('./routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Serve static files from the 'public' directory for reports
app.use('/api/reports/download', express.static('public/reports'));


// Database connection and server start
sequelize.sync({ alter: true }) // Use alter: true to update table schemas without dropping data
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });
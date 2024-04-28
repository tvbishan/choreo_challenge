const { Sequelize } = require('sequelize');

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql', // Or your preferred database dialect
	  host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    timezone: '+05:30', // IST timezone offset
  }
);

sequelize.authenticate().then(() => {
  console.log('The connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
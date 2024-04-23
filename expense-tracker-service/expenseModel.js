const { DataTypes } = require('sequelize');
const sequelize = require('./dbConnection');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Define id as the primary key
    autoIncrement: true, // Automatically generate id values
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  expenseGroup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
	//unique: true, // Ensure uniqueness of email addresses
    validate: {
      isEmail: true, // Validate that the value is an email address
    },
  },  
});

module.exports = Expense;
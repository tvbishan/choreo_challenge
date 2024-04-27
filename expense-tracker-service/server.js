require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const { Sequelize } = require('sequelize');

const Expense = require('./expenseModel');

const app = express();
const PORT = process.env.NODE_PORT || 9090;

app.use(bodyParser.json());

// Sync Expense sequelize model
Expense.sync()
  .then(() => {
    // Code inside this block will be executed after synchronization is complete
    console.log('Expense model synchronized successfully');
  })
  .catch((error) => {
    // Handle synchronization errors here
    console.error('Error occurred during synchronization of Expense model:', error);
  });

// health check endpoint
app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

app.get('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOne({ where: { id } });

    if (!expense) {
      return res.status(404).send({ message: 'Expense not found' });
    }

    res.status(200).send(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).send(error);
  }
});

app.get('/expensesByEmail/:email', async (req, res) => {
  try {
    const { email } = req.params;
    let queryFilter = {};

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required', email: email });
    }

    queryFilter.email = email;

    const expenses = await Expense.findAll({
      where: queryFilter,
      order: [['expenseDate', 'desc']],
    });

    res.status(200).send(expenses);
  } catch (error) {
    console.error('Error occurred while fetching expenses:', error);
    res.status(500).send(error);
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const { email } = req.query;
    let queryFilter = {};

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required', email: email });
    }

    queryFilter.email = email;

    const expenses = await Expense.findAll({
      where: queryFilter,
      order: [['expenseDate', 'desc']],
    });

    res.status(200).send(expenses);
  } catch (error) {
    console.error('Error occurred while fetching expenses:', error);
    res.status(500).send(error);
  }
});

app.post('/expenses', async (req, res) => {
  try {
    const { amount, expenseGroup, note, expenseDate, email } = req.body;
    const newRecord = await Expense.create({ amount, expenseGroup, note, expenseDate, email });
    res.status(201).send(newRecord);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).send(error);
  }
});

app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Expense.destroy({ where: { id: id, } });

    if (deletedRecord === 0) {
      return res.status(404).send({ message: 'Expense not found' });
    }

    res.status(200).send({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error occurred while deleting expense:', error);
    res.status(500).send(error);
  }
});

app.get('/lastMonthExpenses', async (req, res) => {
  try {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Note: January is month 0 in JavaScript

    let lastMonth, lastYear;

    if (currentMonth === 1) {
      // If the current month is January, the last month would be December of the previous year
      lastMonth = 12;
      lastYear = currentYear - 1;
    } else {
      lastMonth = currentMonth - 1;
      lastYear = currentYear;
    }    

    // Constructing the start and end dates for the last month
    const startDate = new Date(lastYear, lastMonth - 1, 1); // 1st day of last month
    const endDate = new Date(lastYear, lastMonth, 0); // Last day of last month

    console.log('startDate:', startDate);
    console.log('endDate:', endDate);

    // Fetching expenses for the last month using Sequelize query
    const expenses = await Expense.findAll({
      where: {
        expenseDate: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    console.log('Expenses for last month:', expenses);

    res.status(200).send(expenses);
  } catch (error) {
    console.error('Error occurred while fetching last month expenses:', error);
    res.status(500).send(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
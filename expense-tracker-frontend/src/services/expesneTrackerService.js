import axios from 'axios';

const EXPENSE_TRACKER_SERVICE_URL = window.configs.apiUrl; //'http://localhost:3000/api'

export const createExpense = async (expenseDetails) => {
  try {
    const response = await fetch(`${EXPENSE_TRACKER_SERVICE_URL}/create-expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseDetails),
    });

    if (!response.ok) {
      const message = `An error has occurred while expense creation: ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const getExpensesByEmail = async (email) => {

  try {
    const response = await axios.get(`${EXPENSE_TRACKER_SERVICE_URL}/expenses`, {
      params: {
        email: email,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error while fetching expenses:', error);
    throw error; // Rethrowing the error
  }
};
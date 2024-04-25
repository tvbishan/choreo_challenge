require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');

const auth = require('./src/auth');

const app = express();
const PORT = process.env.NODE_PORT || 9080;

app.use(bodyParser.json());

const getAccessToken = async () => {
    try {
        const tokenUrl = process.env.EXPENSE_TRACKER_OAUTH_TOKEN_URL;
        const clientId = process.env.EXPENSE_TRACKER_OAUTH_CLIENT_ID;
        const clientSecret = process.env.EXPENSE_TRACKER_OAUTH_CLIENT_SECRET;
    
        const accessToken = await auth(tokenUrl, clientId, clientSecret);
        return accessToken;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error; // Rethrow the error
    }
};

// Function to handle API requests to the expense tracker service
const handleExpenseTrackerRequest = async (method, url, data) => {
    const accessToken = await getAccessToken();
    const expenseTrackerServiceUrl = process.env.EXPENSE_TRACKER_SERVICE_URL;

    if (!expenseTrackerServiceUrl) {
        throw new Error('Expense Tracker service URL is not defined');
    }

    const options = {
        method,
        url: `${expenseTrackerServiceUrl}${url}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    if (method === 'get') {
        options.params = data;
    } else {
        options.data = data;
    }

    return axios(options);
};

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

// Route to fetch expenses
app.get('/expenses', async (req, res) => {
    try {
        const email = req.query.email;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }

        const response = await handleExpenseTrackerRequest('get', '/expensesByEmail', { email });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error occurred while fetching expenses by email:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

// Route to create expense
app.post('/create-expense', async (req, res) => {
    try {
        const response = await handleExpenseTrackerRequest('post', '/expenses', req.body);

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error processing expense creation request:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
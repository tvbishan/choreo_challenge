const axios = require('axios');

const auth = async (tokenUrl, clientId, clientSecret) => {
  try {
    const client_creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${client_creds}`
      },
    });

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error('Authentication unsuccessful:', error);
    throw error;
  }
};

module.exports = auth;
const axios = require('axios');

async function fetchBlogsFromAPI() {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs');
    return response.data; 
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

module.exports = fetchBlogsFromAPI;

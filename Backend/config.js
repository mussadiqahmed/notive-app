// Configuration for different environments
const config = {
  development: {
    baseURL: 'http://192.168.254.207:3000',
    apiURL: 'http://192.168.254.207:3000'
  },
  production: {
    baseURL: 'https://notive-app-backend.onrender.com', // Replace with your actual Render URL
    apiURL: 'https://notive-app-backend.onrender.com'
  }
};

// Get environment (default to development)
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export default config[environment];

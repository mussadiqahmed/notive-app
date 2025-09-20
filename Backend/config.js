// Configuration for different environments
const config = {
  development: {
    baseURL: 'https://notive-app.onrender.com',
    apiURL: 'https://notive-app.onrender.com'
  },
  production: {
    baseURL: 'https://notive-app.onrender.com',
    apiURL: 'https://notive-app.onrender.com'
  }
};

// Get environment (default to development)
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export default config[environment];

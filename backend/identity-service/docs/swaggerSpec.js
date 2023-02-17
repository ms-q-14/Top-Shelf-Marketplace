const swaggerJSDoc = require('swagger-jsdoc');


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for Auth Service',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  };
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;


import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GameHub API',
      version: '1.0.0',
      description: 'API documentation for GameHub Backend',
    },
    servers: [
      {
        url: 'https://gamehub-kzzk.onrender.com',
        description: 'Production Server',
      },
      {
        url: 'https://israel-ramose-premeditatingly.ngrok-free.dev',
        description: 'Ngrok Tunnel',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key for general access (x-api-key header)',
        },
        // Using cookie authentication for access and refresh tokens
        cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'accessToken',
            description: 'JWT Access Token in cookie',
        },
        refreshCookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'refreshToken',
            description: 'JWT Refresh Token in cookie',
        }
      },
    },
    security: [
      {
        ApiKeyAuth: [],
        cookieAuth: [],
      },
    ],
  },
  apis: ['./routers/**/*.js', './controllers/**/*.js', './server.js'], 
};
export const specs = swaggerJsdoc(options);

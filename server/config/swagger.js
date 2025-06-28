const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Descarte Certo API',
      version: '2.0.0',
      description: 'API completa para plataforma de educação ambiental e gamificação',
      contact: {
        name: 'Equipe Descarte Certo',
        email: 'gustavo@descarte-certo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            school: { type: 'string' },
            grade: { type: 'string' },
            points: { type: 'integer' },
            level: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Disposal: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            materialType: { type: 'string', enum: ['PLASTIC', 'GLASS', 'PAPER', 'METAL', 'ORGANIC', 'ELECTRONIC'] },
            weight: { type: 'number' },
            points: { type: 'integer' },
            location: { type: 'string' },
            imageUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            error: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './index.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 
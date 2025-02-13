import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerConfig } from '@docs/api/index.js';

export const specs = swaggerJsdoc(swaggerConfig);

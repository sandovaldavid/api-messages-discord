import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerConfig } from '../docs/index.js';

export const specs = swaggerJsdoc(swaggerConfig);

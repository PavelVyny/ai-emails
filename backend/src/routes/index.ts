import { FastifyInstance } from 'fastify';
import emailRoutes from './emailRoutes';
import aiRoutes from './aiRoutes';

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/cors'), {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Cache-Control'],
    credentials: false,
  });

  fastify.get('/', async (request, reply) => {
    return { message: 'Email API is running :)' };
  });

  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
  });

  await fastify.register(emailRoutes);
  await fastify.register(aiRoutes);
}

import { FastifyInstance } from 'fastify';
import * as emailController from '../controllers/emailController';

export default async function emailRoutes(fastify: FastifyInstance) {
  fastify.get('/api/emails', emailController.getAllEmails);
  fastify.get('/api/emails/:id', emailController.getEmailById);
  fastify.post('/api/emails', emailController.createEmail);
  fastify.put('/api/emails/:id', emailController.updateEmail);
  fastify.delete('/api/emails/:id', emailController.deleteEmail);
}

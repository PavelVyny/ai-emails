import { FastifyInstance } from 'fastify';
import * as aiController from '../controllers/aiController';

export default async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/api/ai/stream-email', aiController.streamEmail);
}

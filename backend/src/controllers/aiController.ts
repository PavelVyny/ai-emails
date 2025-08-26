import { FastifyRequest, FastifyReply } from 'fastify';
import { streamEmailGeneration } from '../services/aiService';
import { GenerateEmailRequest } from '../types/ai.types';

export const streamEmail = async (
  request: FastifyRequest<{ Body: GenerateEmailRequest }>, 
  reply: FastifyReply
) => {
  try {
    const { userInput } = request.body;
    
    if (!userInput) {
      reply.code(400).send({ success: false, error: 'User input required' });
      return;
    }

    // Configure Server-Sent Events for real-time streaming
    reply.type('text/event-stream');
    reply.header('Cache-Control', 'no-cache');
    reply.header('Connection', 'keep-alive');
    reply.raw.write('data: {"type":"connected"}\n\n');

    // Stream response using langchain streamEvents + JsonOutputParser
    // This provides incremental JSON parsing with real-time subject/body field updates
    for await (const chunk of streamEmailGeneration(userInput)) {
      reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`);
      // Force flush the response for immediate delivery
      if ('flush' in reply.raw && typeof reply.raw.flush === 'function') {
        reply.raw.flush();
      }
    }
    
    reply.raw.write('data: [DONE]\n\n');
    reply.raw.end();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    reply.raw.write(`data: ${JSON.stringify({ type: 'error', content: errorMessage })}\n\n`);
    reply.raw.end();
  }
};
import dotenv from 'dotenv';
import Fastify from 'fastify';
import routes from './routes/index';

// Load environment variables from .env file
dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(routes);

const start = async (): Promise<void> => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

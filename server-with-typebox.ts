import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';
import { User, UserType } from './types';

const server = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

server.post<{ Body: UserType; Reply: UserType }>(
  '/',
  {
    schema: {
      body: User,
      response: {
        200: User,
      },
    },
  },
  (request, reply) => {
    const { name, mail } = request.body;
    reply.status(200).send({ name, mail });
  }
);

const start = async () => {
  try {
    server.listen({
      port: 3000,
    });
    server.log.info('run server port: 3000');
  } catch (e) {
    server.log.error(e);
    process.exit(1);
  }
};

start();

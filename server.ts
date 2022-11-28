import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';

const server: FastifyInstance = fastify({
  logger: true,
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string',
          },
        },
      },
    },
  },
};

server.get('/ping', opts, async (request, reply) => {
  return {
    pong: 'OK',
  };
});

// =============== con genericos =======================

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  'h-Custom': string;
}

server.get<{
  Querystring: IQuerystring;
  Headers: IHeaders;
}>(
  '/auth',
  {
    preValidation: (request, reply, done) => {
      const { username, password } = request.query;
      done(username !== 'admin' ? new Error('Must be admin') : undefined); // only validate `admin` account
    },
  },
  async (request, reply) => {
    const query = request.query;
    const customerHeader = request.headers['h-Custom'];

    console.log('query', request.query);
    console.log('header', request.headers);

    return `logged in!`;
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

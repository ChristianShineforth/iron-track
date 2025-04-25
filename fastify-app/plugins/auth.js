import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

async function authPlugin(fastify, options) {
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) throw new Error();

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      request.user = decoded; // attach the decoded user to the request object
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}

export default fp(authPlugin);

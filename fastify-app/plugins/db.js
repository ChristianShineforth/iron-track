import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

async function dbConnector(fastify, options) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    fastify.log.info('MongoDB connected');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

export default fp(dbConnector);

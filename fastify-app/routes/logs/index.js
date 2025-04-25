import WorkoutLog from '../../models/WorkoutLog.js';
import mongoose from 'mongoose';

export default async function logRoutes(fastify, opts) {
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'splitName', 'exercises'],
        properties: {
          userId: { type: 'string', default: "680be6e95933d155718fa0dc" },
          date: { type: 'string', format: 'date-time' },
          splitName: { type: 'string', default: "Push Day" },
          exercises: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', default: "Bench Press" },
                sets: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      reps: { type: 'number', default: 10 },
                      weight: { type: 'number', default: 100 },
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (req, reply) => {
    const { userId, date, splitName, exercises } = req.body;
    const log = await WorkoutLog.create({ userId:new mongoose.Types.ObjectId(userId), date, splitName, exercises });
    reply.send(log);
  });

  fastify.get('/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string', minLength: 24, maxLength: 24, default: "680be6e95933d155718fa0dc" }
        },
        required: ['userId']
      }
    }
  }, async (req, reply) => {
    const logs = await WorkoutLog.find({ userId: new mongoose.Types.ObjectId(req.params.userId) }).sort({ date: -1 });
    reply.send(logs);
  });
}

import WorkoutSplit from '../../models/WorkoutSplit.js';
import mongoose from 'mongoose';

export default async function splitRoutes(fastify, opts) {
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'name'],
        properties: {
          userId: { type: 'string', default: "680be6e95933d155718fa0dc" },
          name: { type: 'string', default: "Pull Day" },
          muscleGroups: {
            type: 'array',
            items: { type: 'string'},
          },
          exercises: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', default: "Seated Rows" },
                targetMuscle: { type: 'string', default: "Back" },
                suggestedSets: { type: 'number', default: 4 },
                suggestedReps: { type: 'string', default: "8-12" }
              },
            }
          }
        }
      }
    }
  }, async (req, reply) => {
    const { userId, name, muscleGroups, exercises } = req.body;
    let split = await WorkoutSplit.findOne({ userId: new mongoose.Types.ObjectId(userId), name });

    if (split) {
      split = await WorkoutSplit.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId), name },
        {
          $addToSet: {
            muscleGroups: { $each: muscleGroups ?? [] }, // avoids duplicates, appends new ones
            exercises: { $each: exercises ?? [] }
          }
        },
        { new: true }
      );
      reply.send(split);
    } else {
      split = await WorkoutSplit.create({ userId: new mongoose.Types.ObjectId(userId), name, muscleGroups, exercises });
      reply.send(split);
    }
  });

  fastify.get('/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string', default: "680be6e95933d155718fa0dc" },
        },
        required: ['userId']
      }
    }
  }, async (req, reply) => {
    const splits = await WorkoutSplit.find({ userId: req.params.userId });
    reply.send(splits);
  });

  fastify.delete('/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      const deleted = await WorkoutSplit.findByIdAndDelete(id);
      if (!deleted) {
        return reply.code(404).send({ error: "Split not found" });
      }
      reply.send({ success: true });
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  });
}

import WorkoutSplit from "../../models/WorkoutSplit.js";

export default async function splitsWithSplitIdRoute(fastify, opts) {
  fastify.get('/:splitId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          splitId: { type: 'string', default: "680fc887f66b93991856e476" },
        },
        required: ['splitId']
      }
    }
  }, async (req, reply) => {
    const { splitId } = req.params;
    try {
      const split = await WorkoutSplit.findById(splitId);
      if (!split) {
        return reply.code(404).send({ error: 'Split not found' });
      }
      reply.send(split);
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  });

  fastify.patch('/:splitId/remove-muscle', {
      schema: {
        params: {
          type: 'object',
          required: ['splitId'],
          properties: {
            splitId: { type: 'string', minLength: 24, maxLength: 24, default: "680fc887f66b93991856e476" } // ObjectId
          }
        },
        body: {
          type: 'object',
          required: ['muscle'],
          properties: {
            muscle: { type: 'string', minLength: 1, default: "Backs" }
          }
        }
      }
    }, async (req, reply) => {
      const { splitId } = req.params;
      const { muscle } = req.body; // muscle group to remove
  
      console.log("Muscle hit", muscle);
      try {
        const updated = await WorkoutSplit.findByIdAndUpdate(
          splitId,
          { $pull: { muscleGroups: muscle } },
          { new: true }
        );
        if (!updated) {
          return reply.code(404).send({ error: "Split not found" });
        }
        reply.send(updated);
      } catch (err) {
        reply.code(500).send({ error: "split remove muscle" + err.message });
      }
  });

  fastify.patch('/:splitId/add-exercise', {
    schema: {
      params: {
        type: 'object',
        required: ['splitId'],
        properties: {
          splitId: { type: 'string', minLength: 24, maxLength: 24, default: "680fc887f66b93991856e476" }
        }
      },
      body: {
        type: 'object',
        required: ['name', 'targetMuscle', 'suggestedSets', 'suggestedReps'],
        properties: {
          name: { type: 'string', default: "Lat Pulldowns" },
          targetMuscle: { type: 'string', default: "Backs" },
          suggestedSets: { type: 'number', default: 4 },
          suggestedReps: { type: 'string', default: "8-12" }
        }
      }
    }
  }, async (req, reply) => {
    const { splitId } = req.params;
    const exercise = req.body;
  
    try {
      const updated = await WorkoutSplit.findByIdAndUpdate(
        splitId,
        { $push: { exercises: exercise } },
        { new: true }
      );
      if (!updated) {
        return reply.code(404).send({ error: "Split not found" });
      }
      reply.send(updated); // Send back the updated split
    } catch (err) {
      reply.code(500).send({ error: "Error adding exercise: " + err.message });
    }
  });
}
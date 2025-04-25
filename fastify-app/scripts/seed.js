import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import WorkoutSplit from '../models/WorkoutSplit.js';
import WorkoutLog from '../models/WorkoutLog.js';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create user
const user = await User.create({ name: 'Chris', email: 'chris@example.com', passwordHash: '...' });

// Create a Push split
await WorkoutSplit.create({
  userId: user._id,
  name: 'Push Day',
  muscleGroups: ['Chest', 'Triceps'],
  exercises: [
    { name: 'Bench Press', targetMuscle: 'Chest', suggestedSets: 4, suggestedReps: '8-10' },
    { name: 'Tricep Dips', targetMuscle: 'Triceps', suggestedSets: 3, suggestedReps: '10-12' },
  ],
});

// Create workout log
await WorkoutLog.create({
  userId: user._id,
  splitName: 'Push Day',
  exercises: [
    {
      name: 'Bench Press',
      sets: [
        { reps: 10, weight: 135 },
        { reps: 8, weight: 145 },
        { reps: 6, weight: 155 },
      ],
    },
    {
      name: 'Tricep Dips',
      sets: [
        { reps: 12, weight: 0 },
        { reps: 10, weight: 0 },
      ],
    },
  ],
});

console.log('Seeded!');
process.exit(0);

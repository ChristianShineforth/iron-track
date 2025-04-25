import mongoose from 'mongoose';

const WorkoutSplitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., Push Day
  muscleGroups: [String], // e.g., ['Chest', 'Triceps']
  exercises: [
    {
      name: String,
      targetMuscle: String,
      suggestedSets: Number,
      suggestedReps: String // e.g., '3x10' or '8-12'
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WorkoutSplit', WorkoutSplitSchema);
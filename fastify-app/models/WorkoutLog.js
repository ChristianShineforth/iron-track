import mongoose from 'mongoose';

const WorkoutLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  splitName: String, // e.g., 'Push Day'
  exercises: [
    {
      name: String,
      sets: [
        {
          reps: Number,
          weight: Number // lbs or kg
        }
      ]
    }
  ]
});

export default mongoose.model('WorkoutLog', WorkoutLogSchema);

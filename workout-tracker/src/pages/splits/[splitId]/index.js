import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { addExerciseToSplit, fetchSplitById } from '../../../lib/api'; // you'll create this API function
import Link from 'next/link';

export default function SplitDetailPage() {
  const router = useRouter();
  const { splitId } = router.query;
  const [split, setSplit] = useState(null);

    // New state for form inputs
    const [exerciseName, setExerciseName] = useState('');
    const [targetMuscle, setTargetMuscle] = useState('');
    const [suggestedSets, setSuggestedSets] = useState(3);
    const [suggestedReps, setSuggestedReps] = useState('10-12');

  useEffect(() => {
    if (!splitId) return; // don't run if splitId isn't loaded yet

    async function loadSplit() {
      try {
        const data = await fetchSplitById(splitId);
        console.log("Data", data);
        setSplit(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadSplit();
  }, [splitId]);

  async function handleAddExercise(e) {
    e.preventDefault();

    try {
      await addExerciseToSplit(splitId, {
        name: exerciseName,
        targetMuscle,
        suggestedSets: Number(suggestedSets),
        suggestedReps,
      });

      // Refresh split after adding
      const data = await fetchSplitById(splitId);
      setSplit(data);

      // Clear form
      setExerciseName('');
      setTargetMuscle('');
      setSuggestedSets(3);
      setSuggestedReps('10-12');
    } catch (err) {
      alert('Failed to add exercise: ' + err.message);
    }
  }

  if (!split || !splitId) return <div>Loading split details...</div>;

  if (splitId && split) {
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold mb-4">{split.name}</h1>

            </div>

            <h2 className="text-xl font-semibold mb-2">Muscle Groups:</h2>
            <ul className="mb-6 list-disc list-inside">
                {split?.muscleGroups && split.muscleGroups.map((muscle, index) => (
                <li key={index}>{muscle}</li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">Exercises:</h2>
            <ul className="list-disc list-inside">
                {split?.exercises && split.exercises.map((exercise, index) => (
                <li key={index}>
                    {exercise.name} - {exercise.targetMuscle} ({exercise.suggestedSets} sets, {exercise.suggestedReps} reps)
                </li>
                ))}
            </ul>

            <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Add New Exercise</h2>
                <form onSubmit={handleAddExercise} className="flex flex-col gap-4">
                <input
                    className="border p-2 rounded"
                    placeholder="Exercise Name"
                    value={exerciseName}
                    onChange={e => setExerciseName(e.target.value)}
                    required
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Target Muscle"
                    value={targetMuscle}
                    onChange={e => setTargetMuscle(e.target.value)}
                    required
                />
                <input
                    className="border p-2 rounded"
                    type="number"
                    placeholder="Suggested Sets"
                    value={suggestedSets}
                    onChange={e => setSuggestedSets(e.target.value)}
                    required
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Suggested Reps"
                    value={suggestedReps}
                    onChange={e => setSuggestedReps(e.target.value)}
                    required
                />
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    type="submit"
                >
                    Add Exercise
                </button>
                </form>
            </div>
            <div className="my-5 flex justify-end">
                <Link href="/splits" className="px-4 py-2 rounded-xl border-2 text-lg">Back to Splits</Link>
            </div>
        </div>
    );
    }
}

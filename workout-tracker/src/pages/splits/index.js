import { useEffect, useState } from 'react';
import { fetchSplits, createSplit, deleteSplit, removeMuscleFromSplit } from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const USER_ID = '680be6e95933d155718fa0dc'; // Change to your test user id

export default function SplitsPage() {
  const [splits, setSplits] = useState([]);
  const [name, setName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState('');
  const router = useRouter();
  // Fetch splits on load
  useEffect(() => {
    fetchSplits(USER_ID).then(setSplits).catch(alert);
  }, []);

  // Add a new split
  async function handleAdd(e) {
    e.preventDefault();
    const split = {
      userId: USER_ID,
      name,
      muscleGroups: muscleGroups.split(',').map(s => s.trim())
    };
    try {
        await createSplit(split)
        const freshSplits = await fetchSplits(USER_ID);
        setSplits(freshSplits);
        setName('');
        setMuscleGroups('');
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(splitId) {
    if (!confirm("Are you sure you want to delete this split?")) return;
    try {
      await deleteSplit(splitId);
      // Refresh the splits list
      const updatedSplits = await fetchSplits(USER_ID);
      setSplits(updatedSplits);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteMuscle(splitId, muscle) {
    try {
        await removeMuscleFromSplit(splitId, muscle);

        const data = await fetchSplits(USER_ID);
        setSplits(data);
      } catch (err) {
        alert(err.message);
      }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Workout Splits</h1>
      <button onClick={() => router.push('/')} className="px-5 mb-3 border-2 rounded-2xl">Home</button>    
      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Split name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Muscle groups (comma-separated)"
          value={muscleGroups}
          onChange={e => setMuscleGroups(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
          Add Split
        </button>
      </form>
      <ul>
        {splits.map(split => (
          <li key={split._id} className="mb-5">
            <div className=' flex flex-row mb-2'>
              <button
                  className="mr-4 px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(split._id)}
              >
                  Delete
              </button>
              <Link href={`/splits/${split._id}`}>
                  <h2 className="text-xl font-semibold cursor-pointer">{split.name}</h2>
              </Link>
            </div>
            <p className="text-sm text-gray-600 ">{split.muscleGroups.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

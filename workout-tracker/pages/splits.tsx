import { useEffect, useState } from 'react';
import { fetchSplits, createSplit } from '../src/lib/api';

const USER_ID = '6806a2d1e7a2b621a9d1f268'; // Replace with a real user id if needed

export default function SplitsPage() {
  const [splits, setSplits] = useState([]);
  const [name, setName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState('');

  useEffect(() => {
    fetchSplits(USER_ID).then(setSplits).catch(console.error);
  }, []);

  async function handleAddSplit(e: React.FormEvent) {
    e.preventDefault();
    const split = {
      userId: USER_ID,
      name,
      muscleGroups: muscleGroups.split(',').map(s => s.trim())
    };
    const newSplit = await createSplit(split);
    setSplits([...splits, newSplit]);
    setName('');
    setMuscleGroups('');
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Workout Splits</h1>
      <form onSubmit={handleAddSplit} style={{ marginBottom: 32 }}>
        <input
          placeholder="Split name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Muscle groups (comma-separated)"
          value={muscleGroups}
          onChange={e => setMuscleGroups(e.target.value)}
          required
        />
        <button type="submit">Add Split</button>
      </form>
      <ul>
        {splits.map((split: any) => (
          <li key={split._id}>
            <b>{split.name}</b> — {split.muscleGroups?.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

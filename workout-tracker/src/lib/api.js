// src/lib/api.js

const API_BASE = 'http://localhost:4000/api'; // Use your Fastify server's address/port

export async function fetchSplits(userId) {
  const res = await fetch(`${API_BASE}/splits/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch splits');
  return res.json();
}

export async function createSplit(split) {
  const res = await fetch(`${API_BASE}/splits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(split)
  });
  if (!res.ok) {
    let message = await res.text();
    throw new Error('Failed to create split: ' + message);
  }
  return res.json();
}

export async function deleteSplit(splitId) {
    const res = await fetch(`${API_BASE}/splits/${splitId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        let message = await res.text();
        throw new Error('Failed to delete split: ' + message);
    }
    return res.json();
}

export async function removeMuscleFromSplit(splitId, muscle) {
    const res = await fetch(`${API_BASE}/splits/${splitId}/remove-muscle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muscle }),
    });
    if (!res.ok) {
      let message = await res.text();
      throw new Error('Failed to remove muscle: ' + message);
    }
    if (res.status === 204) {
      return res.json({
        message: 'Muscle content did not change',
        status: 204,
      });
    }
    return res.json();
}

export async function fetchSplitById(splitId) {
    const res = await fetch(`${API_BASE}/split/${splitId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch split');
    }
    return res.json();
}

export async function addExerciseToSplit(splitId, exercise) {
  const res = await fetch(`${API_BASE}/split/${splitId}/add-exercise`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise),
  });
  if (!res.ok) {
    let message = await res.text();
    throw new Error('Failed to add exercise: ' + message);
  }
  return res.json();
}
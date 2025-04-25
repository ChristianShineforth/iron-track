const API_BASE = 'http://localhost:4000/api'; // adjust if your backend runs elsewhere

export async function fetchSplits(userId: string) {
  const res = await fetch(`${API_BASE}/splits/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch splits');
  return res.json();
}

export async function createSplit(split: any) {
  const res = await fetch(`${API_BASE}/splits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(split)
  });
  if (!res.ok) throw new Error('Failed to create split');
  return res.json();
}
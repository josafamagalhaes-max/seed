const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function getHelloCode(): Promise<{ code: string }> {
  const res = await fetch(`${API_URL}/hello`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<{ code: string }>;
}

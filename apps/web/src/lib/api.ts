const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ── Hello ────────────────────────────────────────────────────────────────────

export async function getHelloCode(): Promise<{ code: string }> {
  const res = await fetch(`${API_URL}/hello`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<{ code: string }>;
}

// ── Clients ──────────────────────────────────────────────────────────────────

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export interface ClientPayload {
  name: string;
  email: string;
  phone?: string;
}

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${API_URL}/clients`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<Client[]>;
}

export async function createClient(data: ClientPayload): Promise<Client> {
  const res = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<Client>;
}

export async function updateClient(
  id: number,
  data: Partial<ClientPayload>,
): Promise<Client> {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<Client>;
}

export async function deleteClient(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

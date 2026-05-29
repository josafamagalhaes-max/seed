import { getHelloCode } from '@/lib/api';
import { RefreshButton } from '@/components/RefreshButton';

export default async function HomePage() {
  let code: string | null = null;
  let error: string | null = null;

  try {
    const data = await getHelloCode();
    code = data.code;
  } catch {
    error = 'Backend indisponível. Verifique se o servidor API está rodando na porta 3001.';
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-8 p-8">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        Hello World
      </h1>

      {error ? (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg max-w-sm text-center">
          {error}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            Código gerado
          </p>
          <span className="font-mono text-7xl font-bold tracking-widest text-indigo-600 select-all">
            {code}
          </span>
        </div>
      )}

      <RefreshButton />
    </main>
  );
}

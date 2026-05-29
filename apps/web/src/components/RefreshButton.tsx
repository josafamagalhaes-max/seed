'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Gerando...' : 'Gerar novo código'}
    </button>
  );
}

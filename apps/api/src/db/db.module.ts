import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE = Symbol('SUPABASE');

function buildSupabaseClient(config: ConfigService) {
  const url = config.getOrThrow<string>('SUPABASE_URL');
  const key = config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
  const proxyUrl = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;

  let customFetch: typeof globalThis.fetch | undefined;

  if (proxyUrl) {
    // Use undici ProxyAgent so Supabase HTTP calls tunnel through the proxy
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { fetch: undiciFetch, ProxyAgent } = require('undici') as typeof import('undici');
    const agent = new ProxyAgent({
      uri: proxyUrl,
      connect: { rejectUnauthorized: false },
    });
    customFetch = (input, init) =>
      undiciFetch(input as Parameters<typeof undiciFetch>[0], {
        ...(init as Parameters<typeof undiciFetch>[1]),
        dispatcher: agent,
      }) as unknown as Promise<Response>;
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    ...(customFetch ? { global: { fetch: customFetch } } : {}),
  });
}

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildSupabaseClient(config),
    },
  ],
  exports: [SUPABASE],
})
export class DbModule {}

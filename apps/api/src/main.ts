import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // ── OpenAPI / Swagger ────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Seed API')
    .setDescription('API do projeto Seed — Turborepo + NestJS + Supabase')
    .setVersion('1.0')
    .addTag('hello', 'Endpoint de verificação')
    .addTag('clients', 'CRUD de clientes')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // ── Scalar API Reference at /api/reference ───────────────────────────────
  app.use(
    '/api/reference',
    apiReference({
      spec: { content: document },
      theme: 'purple',
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
  console.log(`Docs available at http://localhost:${port}/api/reference`);
}

bootstrap();

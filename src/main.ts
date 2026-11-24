import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from 'node:fs';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: readFileSync('CERTIFICADO-DIGITAL/localhost.key'),
      cert: readFileSync('CERTIFICADO-DIGITAL/localhost.crt'),
    },
    bufferLogs: true
  });

  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
  .setTitle(`API de Archivos`)
  .setDescription('Gestionar usuarios')
  .setVersion('1.0.0')
  .addTag('Operaciones de Escritura')
  .addTag('Solo Lectura')
  .addBearerAuth()
  .build();
  
  const document = SwaggerModule.createDocument(
    app, config,
  );
  
  SwaggerModule.setup(
    'api',
    app,
    document,
    {
      swaggerOptions: { persistAuthorization: true },
    }
  );

  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();

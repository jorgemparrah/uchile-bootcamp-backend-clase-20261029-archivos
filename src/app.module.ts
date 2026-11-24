import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileRepository } from './file.repository';
import { ImagenesStorage } from './imagenes.storage';
import { SeguridadService } from './seguridad.service';
import { SeguridadController } from './seguridad.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsuarioService } from './usuario.service';
import { DocumentosModule } from './documentos/documentos.module';
import { AuthController } from './usuario.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConsultarSismosClient } from './client/consultar-sismos.client';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          '*.password',
          '*.token',
          '*.secret',
          '*.accessToken',
          '*.refreshToken',
        ],
        genReqId: (req) => {
          const id = randomUUID();
          return id;
        },
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'trace',
              options: {
                colorize: true,
                singleLine: true,
                levelFirst: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname,req.method,req.remoteAddress,req.remotePort',
                messageFormat: '[{context}] [{req.id}] {if req.method}{req.method}{end}{if req.url} [{req.url}]{end} - {msg}'
              },
            },
            {
              target: 'pino/file',
              level: 'info',
              options: {
                destination: './logs/logs.log',
                mkdir: true,
              }
            },
            {
                target: 'pino-roll',
                options: {
                  file: './logs/app',
                  frequency: 'daily',   // o por tamaño:
                  size: '10k',
                  mkdir: true,
                  dateFormat: 'yyyy-MM-dd'
                }
            },
            {
                target: 'pino-roll',
                level: 'error',
                options: {
                  file: './logs/error',
                  frequency: 'daily',   // o por tamaño:
                  size: '10k',
                  mkdir: true,
                  dateFormat: 'yyyy-MM-dd',
                }
            },
            {
                target: 'pino-roll',
                level: 'warn',
                options: {
                  file: './logs/warn',
                  frequency: 'daily',   // o por tamaño:
                  size: '10k',
                  mkdir: true,
                  dateFormat: 'yyyy-MM-dd',
                }
            }
          ]

        }
      },
    },),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'ARCHIVOS',
      serveRoot: '/public',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100
    }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    DocumentosModule,
  ],
  controllers: [AppController, SeguridadController, AuthController],
  providers: [AppService, UsuarioService, SeguridadService, ConsultarSismosClient, ImagenesStorage, FileRepository,
    {
      provide: APP_GUARD, useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
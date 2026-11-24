import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { ConsultarSismosClient } from 'src/client/consultar-sismos.client';
import { ConsultarAnthropicClient } from 'src/client/consultar-anthropic.client';

@Module({
  imports: [ 
JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService, ConsultarSismosClient, ConsultarAnthropicClient],
})
export class DocumentosModule {}

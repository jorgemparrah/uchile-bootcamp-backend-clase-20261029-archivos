import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagenesStorage } from './imagenes.storage';
import { ConfigModule } from '@nestjs/config';
import { FileRepository } from './file.repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'ARCHIVOS',
      serveRoot: '/public',
    })
  ],
  controllers: [AppController],
  providers: [AppService, ImagenesStorage, FileRepository],
})
export class AppModule {}
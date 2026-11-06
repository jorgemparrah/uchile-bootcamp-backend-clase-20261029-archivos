import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

@Injectable()
export class ImagenesStorage {

  constructor(
    private readonly configService: ConfigService
  ) {}

  async guardarImagen(archivo : Express.Multer.File) {
    try {
      const baseArchivos = this.configService.getOrThrow<string>('BASE_ARCHIVOS');
      const baseDominio = 'PRODUCTOS';

      const fecha = new Date();
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      const hora = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');

      const nombreArchivo = randomUUID();
      const extension = extname(archivo.originalname);
      const nombreArchivoConExtension = `${nombreArchivo}${extension}`;

      const rutaArchivo = join(baseDominio, anio.toString(), mes, dia, hora, minutos, nombreArchivoConExtension);
      const rutaDirectorio = dirname(rutaArchivo);
      await fs.mkdir(join(baseArchivos, rutaDirectorio), { recursive: true });

      const buffer = archivo.buffer;
      await fs.writeFile(join(baseArchivos, rutaArchivo), buffer);

      return rutaArchivo;
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al subir el archivo: ${error.message}`);
    }
  }

  obtenerImagen(path: string) {
    try {
      const baseArchivos = this.configService.getOrThrow<string>('BASE_ARCHIVOS');
      const rutaArchivo = join(baseArchivos, path);
      // PASANDO EL ARCHIVO POR MEMORIA
      // const buffer = await fs.readFile(rutaArchivo);
      // return buffer;

      // SIN PASAR EL ARCHIVO POR MEMORIA
      const stream = createReadStream(rutaArchivo);
      return stream;
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al obtener el archivo: ${error.message}`);
    }
  }

}
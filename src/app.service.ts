import { Injectable, StreamableFile } from '@nestjs/common';
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import { basename, dirname, extname, join, parse, resolve } from 'node:path';
import { ArchivoDto } from './dto/archivo.dto';
import { CargaArchivoBinarioDto } from './dto/carga-archivo-binario.dto';
import { FileRepository } from './file.repository';
import { ImagenesStorage } from './imagenes.storage';
import { MetadatosArchivo } from './metadatos-archivo.entity';

@Injectable()
export class AppService {

  constructor(
    private readonly imagenesStorage: ImagenesStorage,
    private readonly fileRepository: FileRepository,
  ) {
  }

  crearRuta(): string {
    const nuevaRuta = join("src", "prueba", "main.ts")
    console.log('basename', basename(nuevaRuta));
    console.log('dirname', dirname(nuevaRuta));
    console.log('extname', extname(nuevaRuta));
    console.log('parse', parse(nuevaRuta));
    return nuevaRuta;
  }

  crearRutaAbsoluta(): string {
    const nuevaRuta = resolve(this.crearRuta());
    console.log('basename', basename(nuevaRuta));
    console.log('dirname', dirname(nuevaRuta));
    console.log('extname', extname(nuevaRuta));
    console.log('parse', parse(nuevaRuta));
    return nuevaRuta;
  }

  imprimirBuffer(texto: string, codIn: string, codOut: string): string {
    const buffer = Buffer.from(texto, Buffer.isEncoding(codIn) ? codIn : 'utf-8');
    console.log('buffer', buffer);
    return buffer.toString(Buffer.isEncoding(codOut) ? codOut : 'utf-8');
  }

  async escribirArchivo(ruta: string, contenido: string, cod: string = 'utf-8'): Promise<string> {
    try {
      await fs.writeFile(ruta, contenido, {
        encoding: Buffer.isEncoding(cod) ? cod : 'utf-8',
        flag: 'a'
      });
      return "Archivo guardado correctamente";
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al guardar el archivo: ${error.message}`);
    }
  }

  async agregarTextoArchivo(ruta: string, contenido: string, cod: string = 'utf-8'): Promise<string> {
    await fs.appendFile(ruta, contenido, {
      encoding: Buffer.isEncoding(cod) ? cod : 'utf-8',
    });
    return "Archivo guardado correctamente";
  }

  async leerArchivo(ruta: string, cod: string): Promise<ArchivoDto> {
    try {
      const contenido : string = await fs.readFile(ruta, {
        encoding: Buffer.isEncoding(cod) ? cod : 'utf-8'
      });
      const dto = new ArchivoDto();
      dto.ruta = ruta;
      dto.contenido = contenido;
      return dto;

    } catch (error) {
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }

  async leerArchivoBuffer(ruta: string, cod: string): Promise<ArchivoDto> {
    try {
      const bContenido : Buffer = await fs.readFile(ruta);
      const stats = await fs.stat(ruta);
      console.log('stats', stats);
      console.log('isFile', stats.isFile());
      console.log('isDirectory', stats.isDirectory());
      const directorio = dirname(ruta);
      const statDir = await fs.stat(directorio);
      console.log('directorio', directorio);
      console.log('isFile', statDir.isFile());
      console.log('isDirectory', statDir.isDirectory());

      const dto = new ArchivoDto();
      dto.ruta = ruta;
      dto.contenido = bContenido.toString(Buffer.isEncoding(cod) ? cod : 'utf-8');
      return dto;
    } catch (error) {
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }

  async abrirArchivo(ruta: string): Promise<ArchivoDto> {
    console.log('Abriendo archivo:', ruta);
    const handle = await fs.open(ruta, 'rs+');
    try {
      const buffer = await handle.readFile();
      console.log('Contenido actual:', buffer);
      const contenido = buffer.toString('utf-8');
      console.log('Contenido actual:', contenido);
      if (contenido == '1') {
        await handle.writeFile('2');
      } else if (contenido == '2') {
        await handle.writeFile('3');
      } else {
        await handle.writeFile('1');
      }
      const contenidoFinal = await handle.readFile({ encoding: 'utf-8' });
      const dto = new ArchivoDto();
      dto.ruta = ruta;
      dto.contenido = contenidoFinal;
      return dto;
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al abrir el archivo: ${error.message}`);
    } finally {
      await handle.close();
    }
  }

  async copiarArchivo(rutaOrigen: string, rutaDestino: string): Promise<string> {
    try {
      await fs.copyFile(rutaOrigen, rutaDestino, constants.COPYFILE_EXCL);
      return "Archivo copiado correctamente";
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al copiar el archivo: ${error.message}`);
    }
  }

  async moverArchivo(rutaOrigen: string, rutaDestino: string): Promise<string> {
    try {
      await fs.rename(rutaOrigen, rutaDestino);
      return "Archivo movido correctamente";
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al mover el archivo: ${error.message}`);
    }
  }

  async eliminarArchivo(ruta: string): Promise<string> {
    try {
      await fs.unlink(ruta);
      return "Archivo eliminado correctamente";
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error al eliminar el archivo: ${error.message}`);
    }
  }


  async subirArchivo(archivo : Express.Multer.File, datos: CargaArchivoBinarioDto): Promise<any> {
    const ruta = await this.imagenesStorage.guardarImagen(archivo);
    const entidad = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      originalName: archivo.originalname,
      mimeType: archivo.mimetype,
      size: archivo.size,
      ruta: ruta,
    };
    const entidadGuardada = this.fileRepository.save(entidad);
    // TRANSFORMAR A DTO
    return entidadGuardada;
  }

  descargarArchivo(path : string): StreamableFile {
    const contenidoArchivo = this.imagenesStorage.obtenerImagen(path);
    const metadatos = this.fileRepository.findById(path);
    if (!metadatos) {
      throw new Error(`No se encontraron metadatos para el archivo: ${path}`);
    }

    const archivo = new StreamableFile(contenidoArchivo, {
      type: metadatos.mimeType,
      disposition: 'inline',
    });
    return archivo;
  }

  listarArchivos(): MetadatosArchivo[] {
    return this.fileRepository.findAll();
  }

  descargarArchivoOtro(path : string): StreamableFile {
    const contenidoArchivo = this.imagenesStorage.obtenerImagen(path);
    const archivo = new StreamableFile(contenidoArchivo, {
      type: '*',
      disposition: 'attachment',
    });
    return archivo;
  }

}
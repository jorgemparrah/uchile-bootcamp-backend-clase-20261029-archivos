import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { ArchivoDto } from './dto/archivo.dto';
import { CopiaArchivoDto } from './dto/copia-archivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargaArchivoBinarioDto } from './dto/carga-archivo-binario.dto';
import { MetadatosArchivo } from './metadatos-archivo.entity';

@Controller('rutas')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('crear-ruta-relativa')
  crearRuta(): string {
    return this.appService.crearRuta();
  }

  @Get('crear-ruta-absoluta')
  crearRutaAbsoluta(): string {
    return this.appService.crearRutaAbsoluta();
  }

  @ApiParam({ name: 'codIn', required: true, description: 'Codificación IN', enum: ['utf-8', 'hex', 'base64'] })
  @ApiParam({ name: 'codOut', required: true, description: 'Codificación OUT', enum: ['utf-8', 'hex', 'base64'] })
  @Get('imprimir-buffer/:texto/:codIn/:codOut')
  imprimirBuffer(@Param('texto') texto: string, @Param('codIn') codIn: string, @Param('codOut') codOut: string): string {
    return this.appService.imprimirBuffer(texto, codIn, codOut);
  }

  @ApiParam({ name: 'codIn', required: true, description: 'Codificación IN', enum: ['utf-8', 'hex', 'base64'] })
  @Post('escribir-archivo/:codIn')
  escribirArchivo(@Body() archivoDto: ArchivoDto, @Param('codIn') codIn: string): Promise<string> {
    return this.appService.escribirArchivo(archivoDto.ruta, archivoDto.contenido, codIn);
  }

  @ApiParam({ name: 'codIn', required: true, description: 'Codificación IN', enum: ['utf-8', 'hex', 'base64'] })
  @Post('agregar-texto-archivo/:codIn')
  agregarTextoArchivo(@Body() archivoDto: ArchivoDto, @Param('codIn') codIn: string): Promise<string> {
    return this.appService.agregarTextoArchivo(archivoDto.ruta, archivoDto.contenido, codIn);
  }

  @ApiParam({ name: 'codOut', required: true, description: 'Codificación OUT', enum: ['utf-8', 'hex', 'base64'] })
  @ApiParam({ name: 'ruta', required: true, description: 'Ruta del archivo', example: 'prueba/archivo.txt' })
  @Get('leer-archivo/:codOut/:ruta')
  leerArchivoBuffer(@Param('codOut') codOut: string, @Param('ruta') ruta: string): Promise<ArchivoDto> {
    return this.appService.leerArchivoBuffer(ruta, codOut);
  }


  @ApiParam({ name: 'ruta', required: true, description: 'Ruta del archivo', example: 'prueba/archivo.txt' })
  @Get('abrir-archivo/:ruta')
  abrirArchivo(@Param('ruta') ruta: string): Promise<ArchivoDto> {
    return this.appService.abrirArchivo(ruta);
  }

  @ApiBody({ type: CopiaArchivoDto })
  @Post('copiar-archivo')
  copiarArchivo(@Body() carchivoDto: CopiaArchivoDto): Promise<string> {
    return this.appService.copiarArchivo(carchivoDto.rutaOrigen, carchivoDto.rutaDestino);
  }

  @ApiBody({ type: CopiaArchivoDto })
  @Post('mover-archivo')
  moverArchivo(@Body() carchivoDto: CopiaArchivoDto): Promise<string> {
    return this.appService.moverArchivo(carchivoDto.rutaOrigen, carchivoDto.rutaDestino);
  }

  @ApiParam({ name: 'ruta', required: true, description: 'Ruta del archivo', example: 'prueba/archivo.txt' })
  @Delete('eliminar-archivo/:ruta')
  eliminarArchivo(@Param('ruta') ruta: string): Promise<string> {
    return this.appService.eliminarArchivo(ruta);
  }

  @Post('recibir-archivo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CargaArchivoBinarioDto })
  @UseInterceptors(FileInterceptor('imagen'))
  recibirArchivo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Puedes agregar validadores aquí si es necesario
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024, errorMessage: 'El archivo excede el tamaño máximo permitido de 10 MB' }), // 10 MB
          new FileTypeValidator({ fileType: 'image/*', errorMessage: 'El archivo debe ser una imagen JPEG' })
        ],
      })
    ) archivo: Express.Multer.File,
    @Body() datos: CargaArchivoBinarioDto
  ): Promise<any> {
    console.log('Archivo recibido:', archivo);
    console.log('Datos recibidos:', datos);
    return this.appService.subirArchivo(archivo, datos);
  }

  @Get('descargar/:key')
  downloadArchivo(
    @Param('key') key: string
  ): any {
    console.log('Archivo a descargar:', key);
    return this.appService.descargarArchivo(key);
  }

  @Get('descargarOtro/:key')
  downloadArchivoOtro(
    @Param('key') key: string
  ): any {
    console.log('Archivo a descargar:', key);
    return this.appService.descargarArchivoOtro(key);
  }

  @Get('listar-archivos')
  listarArchivos(): MetadatosArchivo[] {
    return this.appService.listarArchivos();
  }

}


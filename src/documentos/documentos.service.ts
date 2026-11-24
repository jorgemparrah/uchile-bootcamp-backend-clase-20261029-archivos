import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Documento } from './entities/documento.entity';
import { ConsultarSismosClient } from 'src/client/consultar-sismos.client';
import { ConsultarAnthropicClient } from 'src/client/consultar-anthropic.client';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class DocumentosService {

  lista: Documento[]

  constructor(
    private readonly logger: PinoLogger,
    private readonly consultarSismosClient: ConsultarSismosClient,
    private readonly consultarAnthropicClient: ConsultarAnthropicClient
  ) {
    this.logger.setContext(DocumentosService.name);
    this.lista = [];
    for (let i = 2; i <= 10; i++) {
      this.lista.push({
        id: i,
        nombre: `Documento ${i}`,
        contenido: `Este es el contenido del documento ${i}`,
        fechaCreacion: new Date(),
        fechaModificacion: new Date(),
        usuarioId: i % 2
      });
    }
  }


  async create(createDocumentoDto: CreateDocumentoDto) {
    const sismos = await this.consultarSismosClient.consultar();
    return sismos.map((s) => ({
      ...s,
      usuarioId: "createDocumentoDto.usuarioId"
    }));
  }

  findAll(usuarioId: number, role: string) {
    this.logger.info('Buscando documentos para el usuario');
    let documentosFiltrados = this.lista;
    if (role === 'CLIENTE') {
      this.logger.info(`Filtrando documentos para el usuario CLIENTE`);
      documentosFiltrados = documentosFiltrados.filter(documento => documento.usuarioId === usuarioId);
    }
    this.logger.info(`Documentos filtrados: ${documentosFiltrados.length}`);
    const documentos = documentosFiltrados.map(documento => {
      const dto = new CreateDocumentoDto();
      dto.id = documento.id;
      dto.nombre = documento.nombre;
      dto.texto = documento.contenido;
      dto.usuarioId = documento.usuarioId;
      return dto;
    });
    this.logger.info(`Documentos mapeados: ${documentos.length}`);
    return documentos;
  }

  findOne(id: number, usuarioId: number) {
    const documento = this.lista.find(doc => doc.id === id && doc.usuarioId === usuarioId);
    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }
    const dto = new CreateDocumentoDto();
    dto.id = documento.id;
    dto.nombre = documento.nombre;
    dto.texto = documento.contenido;
    dto.usuarioId = documento.usuarioId;
    return dto;
  }

  update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    return `This action updates a #${id} documento`;
  }

  async remove(pais: string) {
    const respuesta = await this.consultarAnthropicClient.consultar(pais);
    return respuesta;
  }
}

import { Injectable } from '@nestjs/common';
import { MetadatosArchivo } from './metadatos-archivo.entity';

@Injectable()
export class FileRepository {

  metadatosArchivo: MetadatosArchivo[];

  constructor(
  ) {
    this.metadatosArchivo = [];
  }

  findById(id: string): MetadatosArchivo | undefined {
    return this.metadatosArchivo.find(m => m.ruta === id);
  }

  findAll(): MetadatosArchivo[] {
    return this.metadatosArchivo;
  }

  save(entity: MetadatosArchivo): MetadatosArchivo {
    this.metadatosArchivo.push(entity);
    return entity;
  }

  delete(id: string): boolean {
    const index = this.metadatosArchivo.findIndex(m => m.ruta === id);
    if (index !== -1) {
      this.metadatosArchivo.splice(index, 1);
      return true;
    }
    return false;
  }

}
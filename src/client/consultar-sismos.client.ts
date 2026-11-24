import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsultarSismosClient {

  constructor(
    private readonly configService: ConfigService
  ) {
  }

  async consultar() {
    const url = this.configService.getOrThrow<string>('URL_CONSULTA_SISMOS');
    try {
          const res = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(30000) // 5 segundos de timeout
          });
          if (!res.ok) {
            console.log(res.status);
            throw new Error(`HTTP ${res.status}`);
          }
          const eventos = await res.json();
          return eventos;// this.documentosService.create(createDocumentoDto);
        } catch (error) {
          console.error(error);
          throw new GatewayTimeoutException('Error al obtener los eventos de sismos, intente más tarde');
        }
  }

}
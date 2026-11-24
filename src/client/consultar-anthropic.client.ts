import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ConsultarAnthropicClient {

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {
  }

  async consultar(pais: string) {
    const url = this.configService.getOrThrow<string>('URL_CONSULTA_ANTHROPIC');
    const apiKey = this.configService.getOrThrow<string>('API_KEY_ANTHROPIC');
    const workspaceId = this.configService.getOrThrow<string>('ID_WORKSPACE');
    try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-workspace-id': workspaceId,
              'anthropic-version': '2026-10-21', // Versión de la API (por ejemplo, 2026-10-21)
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              messages: [
                {"role": "user", "content": `Responde en español y en formato json (no markdown, ni json en formato markdown), siguiendo estrictamente la estructura de JSON válida ({ pais: <pais>, capital: <ciudad> }). Cual es la capital de ${pais}`}
              ],
              model: 'claude-haiku-5-5', // OPUS 5.5
              max_tokens: 1024,
            }),
            // signal: AbortSignal.timeout(30000) // 5 segundos de timeout
          });
          if (!res.ok) {
            this.logger.error(res.status);
            this.logger.error(await res.text());
            throw new Error(`HTTP ${res.status}`);
          }
          const eventos = await res.json();
          this.logger.log(`Eventos recibidos correctamente`); //INFO
          this.logger.debug(`Cantidad de eventos recibidos: ${eventos.content.length}`); //DEBUG
          this.logger.verbose(`Eventos recibidos: ${JSON.stringify(eventos)}`); // TRACE
          return eventos.content[0].text;// this.documentosService.create(createDocumentoDto);
        } catch (error) {
          console.error(error);
          throw new GatewayTimeoutException('Error al obtener los eventos de sismos, intente más tarde');
        }
  }

}
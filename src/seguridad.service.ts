import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { constants, createCipheriv, createDecipheriv, createHash, privateDecrypt, publicEncrypt, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { InformacionCifradaDto } from './dto/informacion-cifrada.dto';
import { TextoDto } from './dto/texto.dto';
import * as argon2 from 'argon2';
import { TextoHashDto } from './dto/texto-hash.dto';

@Injectable()
export class SeguridadService {

  constructor(
    private readonly configService: ConfigService
  ) {}

  cifrarSimetrico(dto: TextoDto) {
    const keyHex : string = this.configService.getOrThrow<string>('KEY_CIFRADO_SIMETRICO');
    const key = Buffer.from(keyHex, 'hex');

    const iv = randomBytes(12);  // nonce de 96 bits
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([
      cipher.update(dto.contenido, 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    const ivText = iv.toString('hex');
    const tagText = tag.toString('hex');
    
    const keyText = key.toString('hex');
    const textoAlmacenar = `${ivText}:${encrypted.toString('hex')}:${tagText}`;

    const response = new InformacionCifradaDto();
    response.textoEncriptado = encrypted.toString('hex');
    response.iv = ivText;
    response.tag = tagText;


    return response;

  }

  descrifrarSimetrico(ivString: string, textoEncriptado: string, tag: string){

    const keyHex : string = this.configService.getOrThrow<string>('KEY_CIFRADO_SIMETRICO');
    const key = Buffer.from(keyHex, 'hex');


    const iv = Buffer.from(ivString, 'hex');
    const encrypted = Buffer.from(textoEncriptado, 'hex');
    const authTag = Buffer.from(tag, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
    decipher.update(encrypted),
      decipher.final(),
    ]);

    const response = new TextoDto();
      response.contenido = decrypted.toString('utf8');
      return response;
  }

    cifrarAsimetrico(dto: TextoDto) {
      const publicKey  = readFileSync('LLAVES/public.pem', 'utf8');
      const texto = publicEncrypt({
        key: publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
      },
        Buffer.from(dto.contenido, 'utf8'));
      const response = new TextoDto();
      response.contenido = texto.toString('hex');
      return response;
    }

    descifrarAsimetrico(dto: TextoDto) {
      const encrypted = Buffer.from(dto.contenido, 'hex');
      const privateKey = readFileSync('LLAVES/private.pem', 'utf8');

      const decrypted = Buffer.concat([
        privateDecrypt({
          key: privateKey,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
        }, encrypted)
      ]);

      const response = new TextoDto();
      response.contenido = decrypted.toString('utf8');
      return response;
    }

    hashing(dto: TextoDto) : TextoDto {
      const salt = randomBytes(16).toString('hex');


      const hash : string = createHash('sha256')
        .update(`${dto.contenido}-${salt}`)
        .digest('hex');

      const response = new TextoDto();
      response.contenido = `${hash}|${salt}`;
      return response;
    }

    hashingWithSalt(dto: TextoDto, salt: string) : TextoDto {
      const hash : string = createHash('sha256')
        .update(`${dto.contenido}-${salt}`)
        .digest('hex');

      const response = new TextoDto();
      response.contenido = `${hash}|${salt}`;
      return response;
    }

    async hashingArgon2(dto: TextoDto) : Promise<TextoDto> {
      const hash = await argon2.hash(dto.contenido, {
        type: argon2.argon2id,
      });
      const response = new TextoDto();
      response.contenido = hash;
      return response;
    }

    async verificarHashingArgon2(dto: TextoHashDto) : Promise<boolean> {
      const isValid = await argon2.verify(dto.hash, dto.contenido);
      return isValid;
    }


}
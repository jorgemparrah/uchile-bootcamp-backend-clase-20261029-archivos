import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/decorator/role.decorator';
import { PinoLogger } from 'nestjs-pino';

@Controller('documentos')
export class DocumentosController {
  
  constructor(
    private readonly logger: PinoLogger,
    private readonly documentosService: DocumentosService
  ) {
    this.logger.setContext(DocumentosController.name);
  }


  @Roles('CLIENTE')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentosService.create(createDocumentoDto);
  }

  @Roles('CLIENTE', 'ADMIN')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get()
  findAll(@Req() request) {
    this.logger.assign({ usuarioId: request.datosUsuario.id });
    const user = request.datosUsuario;
    const usuarioId = user.id;
    const role = user.role;
    return this.documentosService.findAll(usuarioId, role);
  }

  @Roles('CLIENTE')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request) {
    const user = request.datosUsuario;
    const usuarioId = user.id;
    return this.documentosService.findOne(+id, usuarioId);
  }

  @Roles('CLIENTE')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentoDto: UpdateDocumentoDto) {
    return this.documentosService.update(+id, updateDocumentoDto);
  }

  @Roles('ADMIN')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentosService.remove(id);
  }
}

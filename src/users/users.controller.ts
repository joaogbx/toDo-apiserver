import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';
import { AuthTokenGuard } from 'src/common/guards/auth-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
('');

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneUser(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const mimeType = file.mimetype;
    const fileExtension = path.extname(file.originalname);

    console.log('mimmetype', mimeType);
    console.log('filextension', fileExtension);
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  /**
   * Endpoint POST para upload de uma única imagem.
   * @param file A imagem enviada no corpo da requisição, extraída pelo FileInterceptor.
   * @returns O resultado do processamento feito pelo Service.
   */
  @Post('imagem-unica')
  // 1. O FileInterceptor usa 'imagem' como o nome do campo no formulário multipart.
  // 2. Ele processa o arquivo e injeta no parâmetro decorado com @UploadedFile().
  // 3. Opcional: Você pode passar opções do Multer aqui, como { dest: './uploads' }.
  @UseInterceptors(FileInterceptor('imagem'))
  async fazerUploadImagem(@UploadedFile() file: Express.Multer.File) {
    // 💡 O Controller APENAS lida com a requisição e chama o Service.
    if (!file) {
      // Lógica de erro para quando nenhum arquivo é enviado
      return { mensagem: 'Nenhum arquivo enviado.' };
    }

    return this.usersService.processarUploadImagem(file);
  }
}

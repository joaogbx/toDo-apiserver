import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import path from 'node:path';
import { User } from 'prisma/generated/prisma';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'node:fs/promises';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProtocol: HashingServiceProtocol,
  ) {}

  async findOneUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        tasks: true,
      },
    });

    if (user) return user;

    throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingProtocol.hash(
        createUserDto.password,
      );

      const newUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password_hash: passwordHash,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return newUser;
    } catch (error) {
      throw new HttpException(
        'Falha ao cadastrar usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      const updateData: Partial<User> = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
        email: updateUserDto.email ? updateUserDto.email : user.email,
      };

      if (updateUserDto.password) {
        const passwordHash = await this.hashingProtocol.hash(
          updateUserDto.password,
        );
        updateData.password_hash = passwordHash;
      }

      await this.prisma.user.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      return {
        name: updateData.name,
        email: updateData.email,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });

      return 'Usuário deletado com sucesso';
    } catch (error) {
      throw new HttpException(
        'Falha ao deletar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async processarUploadImagem(file: Express.Multer.File) {
    // 💡 Lógica de Negócios AQUI:
    // 1. Salvar os metadados no banco de dados.
    // 2. O arquivo já foi salvo localmente (se o multer estiver configurado para isso).
    // 3. Opcional: Manipular o 'file.buffer' e enviá-lo para a nuvem.

    // Para fins didáticos, apenas retornamos as informações do arquivo.
    const resultado = {
      mensagem: 'Upload da imagem processado com sucesso!',
      nomeOriginal: file.originalname,
      nomeGerado: file.filename, // Se configurou o `diskStorage` para renomear
      mimeType: file.mimetype,
      tamanho: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      // Se estivesse salvo localmente em 'uploads/', você teria:
      // urlLocal: `http://localhost:3000/uploads/${file.filename}`,
    };

    const fileLocale = path.resolve(process.cwd(), 'files', file.originalname);

    await fs.writeFile(fileLocale, file.buffer);

    console.log('Informacções da Imagem no Service:', resultado);

    return resultado;
  }
}

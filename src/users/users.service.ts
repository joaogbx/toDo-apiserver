import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'prisma/generated/prisma';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

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
}

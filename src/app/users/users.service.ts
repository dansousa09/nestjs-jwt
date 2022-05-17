import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserEntity } from './users.entity'

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>) { }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  async findOneOrFail(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    try {
      return await this.usersRepository.findOneOrFail(options);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const hash = hashSync(data.password, 10);
    await this.usersRepository.save({ ...data, password: hash });

    const user = await this.usersRepository.findOneOrFail({
      where: { email: data.email },
      select: ['id', 'firstName', 'lastName', 'email', 'createdAt']
    });
    return user;
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserEntity> {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async delete(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    return await this.usersRepository.remove(user);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

const VALID_AVATARS = new Set([
  'cat',
  'dog',
  'fox',
  'panda',
  'rabbit',
  'bear',
  'tiger',
  'koala',
  'frog',
  'penguin',
  'lion',
  'cow',
  'pig',
  'octopus',
  'unicorn',
  'dragon',
  'monkey',
  'chicken',
  'duck',
  'owl',
  'squirrel',
  'hamster',
  'wolf',
  'elephant',
]);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(email: string, password: string, fullName: string): Promise<User> {
    const user = this.usersRepository.create({ email, password, fullName });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateAvatar(id: number, avatar: string): Promise<User> {
    if (!VALID_AVATARS.has(avatar)) {
      throw new BadRequestException('Avatar khong hop le!');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.avatar = avatar;
    return this.usersRepository.save(user);
  }
}

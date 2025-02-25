import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/db-entity/base.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UserRespository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findUsersByDisplayName(
    displayName: string,
    limit: number,
  ): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        where: {
          displayName: ILike(`%${displayName}%`),
        },
        take: +limit,
        select: {
          id: true,
          displayName: true,
          profilePicture: true,
        },
      });

      return users;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

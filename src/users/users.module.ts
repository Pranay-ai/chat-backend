import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRespository } from './user.repository';
import { AWSFileService } from 'src/common/utilities/aws-file.service';
import { RedisService } from 'src/common/utilities/redis.service';
import { EmailService } from 'src/common/utilities/email.service';
import { AuthService } from 'src/common/utilities/Auth.service';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, ],
  providers: [UsersService, UserRespository, AWSFileService, RedisService, EmailService, AuthService],
  exports: [UsersService, UserRespository]
})
export class UsersModule {}

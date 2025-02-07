import { PartialType } from '@nestjs/mapped-types';
import { UserSignUpDto } from './sign-up.dto';

export class UpdateUserDto extends PartialType(UserSignUpDto) {}

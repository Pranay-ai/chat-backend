import { BadRequestException, Injectable, Response } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRespository } from './user.repository';
import { UserSignUpDto } from './dto/sign-up.dto';
import { hash, compare } from 'bcrypt';
import { User } from './entities/user.entity';
import { UserSignInDto } from './dto/sign-in.dto';
import { PrivateKey } from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';
import { stat } from 'fs';

@Injectable()
export class UsersService {

  constructor(private readonly userRepository: UserRespository) {}


  async signUp(user: UserSignUpDto) {
    const userExist = await this.userRepository.findByEmail(user.email);
    
    if (userExist) {
      throw new BadRequestException('User With This Email Already Exists');
    }
  
    user.password = await hash(user.password, 10);
    const newUser = await this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
  

    return {
      message: 'User Created Successfully',
      statusCode: 201,
      status: true,
      data: {
        email: savedUser.email,
        firstName: savedUser.firstName,
        id: savedUser.id,
      },
    };
  }

  


  async findOne(id: string) {

    let user;
    try {
      user = await  this.userRepository.findOneById(id);
    } catch (error) {
      throw new BadRequestException('User Not Found');
    }
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    const { password, ...result } = user;
    return {
      message: 'User Found',
      status: true,
      statusCode: 200,
      data: result,
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  async signIn(user: UserSignInDto) {

    const iuser= await this.userRepository.findByEmail(user.email);

    if (!iuser) {
      throw new BadRequestException('User With This Email Does Not Exist');
    }

    const isMatch = await compare(user.password, iuser.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    const accessToken= await this.generateAccessToken(iuser);

    const { password, ...result} = iuser;

    return {
      message: 'User Logged In Successfully',
      status:true,
      statusCode: 200,
      data: {
        ...result,
        accessToken
      }
    }
  }





  async updateUser(id: string, user: UpdateUserDto){

    const userExist= await this.userRepository.findOneById(id);

    if(!userExist){
      throw new BadRequestException('User Not Found');
    }

    const updatedUser= Object.assign(userExist, user);

    const result= await this.userRepository.save(updatedUser);



    return {
      message: 'User Updated Successfully',
      status: true,
      statusCode: 200,
      data: result
    }

  }

  async generateAccessToken(user:User){

    const payload= {id:user.id, email:user.email};
    const JWT_SECRET=process.env.JWT_SECRET as PrivateKey;
    const accessToken= sign(payload, JWT_SECRET, {expiresIn:'1h'});
    return accessToken;
  }
}

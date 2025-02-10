import { BadRequestException, Injectable, Response } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRespository } from './user.repository';
import { UserSignUpDto } from './dto/sign-up.dto';
import { hash, compare } from 'bcrypt';
import { User } from './entities/user.entity';
import { UserSignInDto } from './dto/sign-in.dto';
import { PrivateKey, sign } from 'jsonwebtoken';
import { AuthService } from 'src/common/utilities/Auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRespository,
    private readonly authService: AuthService,
  ) {}

  async signUp(user: UserSignUpDto, @Response() res) {
    const userExist = await this.userRepository.findByEmail(user.email);

    if (userExist) {
      return res.status(400).json({
        message: 'User With This Email Already Exists',
        status: false,
        statusCode: 400,
      });
    }

    user.password = await hash(user.password, 10);
    const newUser = await this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);

    return res.status(201).json({
      message: 'User Created Successfully',
      statusCode: 201,
      status: true,
      data: {
        email: savedUser.email,
        firstName: savedUser.firstName,
        id: savedUser.id,
      },
    });
  }

  async findOne(id: string, @Response() res) {
    try {
      const user = await this.userRepository.findOneById(id);

      if (!user) {
        return res.status(404).json({
          message: 'User Not Found',
          status: false,
          statusCode: 404,
        });
      }

      const { password, ...result } = user;
      return res.status(200).json({
        message: 'User Found',
        status: true,
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'User Not Found',
        status: false,
        statusCode: 400,
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, @Response() res) {
    const userExist = await this.userRepository.findOneById(id);

    if (!userExist) {
      return res.status(404).json({
        message: 'User Not Found',
        status: false,
        statusCode: 404,
      });
    }

    const updatedUser = Object.assign(userExist, updateUserDto);
    const result = await this.userRepository.save(updatedUser);

    return res.status(200).json({
      message: 'User Updated Successfully',
      status: true,
      statusCode: 200,
      data: result,
    });
  }

  async remove(id: string, @Response() res) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User Not Found',
        status: false,
        statusCode: 404,
      });
    }

    await this.userRepository.delete(id);
    return res.status(200).json({
      message: 'User Deleted Successfully',
      status: true,
      statusCode: 200,
    });
  }

  async signIn(user: UserSignInDto, @Response() res) {
    const iuser = await this.userRepository.findByEmail(user.email);

    if (!iuser) {
      return res.status(404).json({
        message: 'User With This Email Does Not Exist',
        status: false,
        statusCode: 404,
        data: null,
      });
    }

    const isMatch = await compare(user.password, iuser.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid Credentials',
        status: false,
        statusCode: 400,
        data: null,
      });
    }

    const accessToken = await this.generateAccessToken(iuser);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'User Logged In Successfully',
      status: true,
      statusCode: 200,
      data: {
        id: iuser.id,
        email: iuser.email,
        emailVerified: iuser.emailVerified,
        firstName: iuser.firstName,
        lastName: iuser.lastName,
      },
    });
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string, @Response() res) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User Not Found',
        status: false,
        statusCode: 404,
      });
    }

    const isMatch = await compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current Password is Incorrect',
        status: false,
        statusCode: 400,
      });
    }

    user.password = await hash(newPassword, 10);
    const { password, ...result } = await this.userRepository.save(user);

    return res.status(200).json({
      message: 'Password Updated Successfully',
      status: true,
      statusCode: 200,
      data: result,
    });
  }

  async generateOtp(id: string, @Response() res) {
    const otp = await this.authService.sendOtp(id);
    return res.status(200).json({
      message: 'OTP Sent Successfully',
      status: true,
      statusCode: 200,
    });
  }

  async verifyOtp(id: string, otp: string, @Response() res) {
    const verificationResult = await this.authService.verifyOtp(id, otp);

    if (!verificationResult) {
      return res.status(400).json({
        message: 'Invalid OTP',
        status: false,
        statusCode: 400,
      });
    }

    return res.status(200).json({
      message: 'OTP Verified Successfully',
      status: true,
      statusCode: 200,
    });
  }

  async signOut(@Response() res) {
    res.clearCookie("token");
    return res.status(200).json({
      message: 'Logged out successfully',
      status: true,
      statusCode: 200,
    });
  }

  async generateAccessToken(user: User) {
    const payload = { id: user.id, email: user.email };
    return sign(payload, process.env.JWT_SECRET as PrivateKey, { expiresIn: '1h' });
  }
}

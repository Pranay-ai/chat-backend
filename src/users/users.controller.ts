import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Response,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/sign-up.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AWSFileService } from 'src/common/utilities/aws-file.service';
import { UserSignInDto } from './dto/sign-in.dto';
import { AuthenticationGaurd } from 'src/common/gaurd/authentication.gaurd';
import { IsSameUserGuard } from 'src/common/gaurd/authorization.gaurd';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly awsFileService: AWSFileService,
  ) {}

  @Post('sign-up')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          callback(new Error('Only image files are allowed!'), false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePicture: { type: 'string', format: 'binary' },
        email: { type: 'string' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        displayName: { type: 'string' },
      },
    },
  })
  async signUp(
    @Body() userSignUpDto: UserSignUpDto,
    @UploadedFile() file: Express.Multer.File,
    @Response() res,
  ) {




    const newUser: UserSignUpDto = { ...userSignUpDto, profilePicture: '' };

    if (file) {
      const fileUrl = await this.awsFileService.uploadFile(
        file.buffer,
        userSignUpDto.displayName,
        file.mimetype,
      );
      newUser.profilePicture = fileUrl;
    }

    return this.usersService.signUp(newUser, res);
  }

  @Post('sign-in')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async signIn(@Body() userSignInDto: UserSignInDto, @Response() res) {
    return this.usersService.signIn(userSignInDto, res);
  }

  @UseGuards(AuthenticationGaurd)
  @Get('me')
  async getMe(@CurrentUser() user, @Response() res) {
    return res.status(200).json({
      message: 'User details fetched successfully',
      status: true,
      statusCode: 200,
      data: user,
    });
  }

  @UseGuards(AuthenticationGaurd)
  @Get(':id')
  async findOne(@Param('id') id: string, @Response() res) {
    return this.usersService.findOne(id, res);
  }

  @UseGuards(AuthenticationGaurd, IsSameUserGuard)
  @Patch('update-user/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        displayName: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Response() res) {
    return this.usersService.update(id, updateUserDto, res);
  }

  @UseGuards(AuthenticationGaurd, IsSameUserGuard)
  @Patch('update-password/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto, @Response() res) {
    return this.usersService.updatePassword(id, updatePasswordDto.currentPassword, updatePasswordDto.newPassword, res);
  }

  @UseGuards(AuthenticationGaurd)
  @Post('sign-out')
  async signOut(@Response() res) {
    return this.usersService.signOut(res);
  }

  @Post('generate-otp/:id')
  async generateOtp(@Param('id') id: string, @Response() res) {
    return this.usersService.generateOtp(id, res);
  }

  @Post('verify-otp/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'string' },
      },
    },
  })
  async verifyOtp(@Param('id') id: string, @Body('otp') otp: string, @Response() res) {
    return this.usersService.verifyOtp(id, otp, res);
  }
}

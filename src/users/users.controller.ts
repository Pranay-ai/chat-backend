import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/sign-up.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AWSFileService } from 'src/common/utilities/aws-file.service';
import { UserSignInDto } from './dto/sign-in.dto';
import { AuthenticationGaurd } from 'src/common/gaurd/authentication.gaurd';
import { IsSameUserGuard } from 'src/common/gaurd/authorization.gaurd';


@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly awsFileService: AWSFileService) {}

  @Post('sign-up')
  @UseInterceptors(FileInterceptor('profilePicture',{
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        callback(new Error('Only image files are allowed!'), false);
      } else {
        callback(null, true);
      }
    }
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
        
        },
        // Add any other sign-up fields you want in the request body:
        email: { type: 'string' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        displayName: { type: 'string' }
        // etc.
      },
    },
  })
  async signUp(
    @Body() userSignUpDto: UserSignUpDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    const newUser : UserSignUpDto = {...userSignUpDto, profilePicture:""}

    if(!file) {
    return this.usersService.signUp(newUser);
    }
    // Upload the file to S3

    const fileUrl = await this.awsFileService.uploadFile(
      file.buffer, // Send the file buffer
      userSignUpDto.displayName, // Preserve the original name and extension
      file.mimetype // Pass the correct MIME type
    );
    // Update the DTO with the file URL
    userSignUpDto.profilePicture = fileUrl;


    return this.usersService.signUp(userSignUpDto);
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
  async signIn(@Body() userSignInDto: UserSignInDto){
    console.log(userSignInDto)
    return await this.usersService.signIn(userSignInDto);
  }


  @UseGuards(AuthenticationGaurd)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthenticationGaurd, IsSameUserGuard)
  @Patch('update-user/:id')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        displayName: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      }
    }
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

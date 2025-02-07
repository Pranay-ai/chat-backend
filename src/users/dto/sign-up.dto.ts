
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class UserSignUpDto{

    @IsNotEmpty({message: 'Display name is required'})
    @IsString({message: 'Display name must be a string'})
    displayName: string;

    @IsNotEmpty({message: 'First name is required'})
    @IsString({message: 'First name must be a string'})
    firstName: string;

    @IsNotEmpty({message: 'Last name is required'})
    @IsString({message: 'Last name must be a string'})
    lastName: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    },{message: 'Password is weak'})
    password: string;

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Invalid email'})
    email: string;


    profilePicture: string;

}
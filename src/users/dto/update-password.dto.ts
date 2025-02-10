import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UpdatePasswordDto {

    @IsString({message: 'Current password must be a string'})
    @IsNotEmpty({message: 'Current password is required'})
    currentPassword: string;

    @IsString({message: 'New password must be a string'})
    @IsNotEmpty({message: 'New password is required'})
    @IsStrongPassword({
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    },{message: 'Password is too weak'})
    newPassword: string;
}
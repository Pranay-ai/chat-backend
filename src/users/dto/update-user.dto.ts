import { IsOptional } from "class-validator";


export class UpdateUserDto  {

    @IsOptional()
    displayName: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsOptional()
    profilePicture: string;

}

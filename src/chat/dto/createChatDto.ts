import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateChatDto {


    @IsUUID(4)
    createdBy: string;

    @IsArray({})
    @IsUUID(4,{ each: true })
    userIds: string[];

    @IsBoolean()
    isPrivate: boolean;


    @IsString()
    @IsOptional()
    name?: string;
}
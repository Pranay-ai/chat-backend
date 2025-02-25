import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateChatDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;
  
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    userIds?: string[];
  }
  
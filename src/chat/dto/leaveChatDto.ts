import { IsString } from "class-validator";

export class LeaveChatDto {
    @IsString()
    userId: string;
  }
  
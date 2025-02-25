import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/common/db-mongoose/db-monogo.schema";

@Schema({
    timestamps: true,
  })
  export class Chat extends BaseSchema {
    @Prop({ required: true })
    createdBy: string;
  
    @Prop([String])
    userIds: string[];
  
    @Prop({ required: true, default: false })
    isPrivate: boolean;
  
    @Prop()
    name?: string;
  }
  

export const ChatSchema = SchemaFactory.createForClass(Chat);
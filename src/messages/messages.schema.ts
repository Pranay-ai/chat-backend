import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/common/db-mongoose/db-monogo.schema";
import { Types } from "mongoose";

@Schema({ timestamps: true })  // Adds createdAt & updatedAt fields
export class Message extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: "Chat", required: true })
  chatId: string;  // References the Chat the message belongs to

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  senderId: string;  // The user who sent the message

  @Prop({ required: true })
  content: string;  // Message content (text)

  @Prop({ default: false })
  isRead: boolean;  // Whether the message is read or not
}

export const MessageSchema = SchemaFactory.createForClass(Message);

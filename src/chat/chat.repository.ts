import { Injectable } from "@nestjs/common";
import { AbstractRepository } from "src/common/db-mongoose/db-mongo.respository";
import { Chat } from "./chat.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ChatRepository extends AbstractRepository<Chat> {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {
        super(chatModel);
    }

    async getChatsByUser(userId: string) {
        return this.chatModel.find({ userIds: userId }).exec();
    }

    async removeUserFromChat(chatId: string, userId: string) {
        const chat = await this.chatModel.findByIdAndUpdate(
            chatId,
            { $pull: { userIds: userId } }, 
            { new: true } 
        ).exec();
    
        if (!chat) {
            throw new Error("Chat not found");
        }
    
        if (!chat.isPrivate && chat.userIds.length === 0) {
            await this.chatModel.findByIdAndDelete(chatId);
            return { message: "Chat deleted as no participants remained" };
        }
    
        return chat;
    }
    
}

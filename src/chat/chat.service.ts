import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateChatDto } from './dto/createChatDto';
import { UpdateChatDto } from './dto/updateChatDto';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ChatService {


  constructor(private readonly chatRepository: ChatRepository,
    private readonly messageService: MessagesService
  ) {}

  async createChat(createChatDto: CreateChatDto , res) {
    const chat = await this.chatRepository.create(createChatDto);
    if(!chat) {
      return res.status(400).send({message: 'Error creating chat'});
    }
    else {
      return res.status(201).send(chat);
    }
  }

  async getChatsByUser(userId: string , res) {

    if(res === null){
      try {
        const chats = await this.chatRepository.getChatsByUser(userId);
        const chatIds = chats.map(chat => chat._id.toString());

        return chatIds;
      } catch (error) {
        return { message: 'Error getting chats' };
      }
      

    }
    const chats = await this.chatRepository.getChatsByUser(userId);
    if(!chats) {
      return res.status(400).send({message: 'Error getting chats'});
    }
    else {
      return res.status(200).send(chats);
    }
  }  
  
  
  async updateChat(chatId: string, updateChatDto: UpdateChatDto, res) {
    const updatedChat = await this.chatRepository.update(chatId, updateChatDto);
    if(!updatedChat) {
      return res.status(400).send({message: 'Error updating chat'});
    }
    else {
      return res.status(200).send(updatedChat);
    }

  }

  async deleteChat(chatId: string , res) {
    const chat = await this.chatRepository.delete(chatId) 
    if(!chat) {
      return res.status(400).send({message: 'Error deleting chat'});
    }
    else {
      return res.status(200).send(chat);
    }
  }

  async removeUserFromChat(chatId: string, userId: string, res) {

    const chat = await this.chatRepository.removeUserFromChat(chatId, userId);
    if(!chat) {
      return res.status(400).send({message: 'Error removing user from chat'});
    }
    else {
      return res.status(200).send(chat);
    }
  }

  async getChatsForUser(userId: string, res) {

    const chats = await this.chatRepository.getChatsByUser(userId);

    const chatIds = chats.map(chat => chat._id.toString());

    const lstMessages = await Promise.all(chatIds.map(chatId => this.messageService.getLastMessageByChat(chatId)));











  }

}

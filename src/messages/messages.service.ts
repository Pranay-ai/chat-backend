import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {


  constructor(private readonly messagesRepository: MessagesRepository) {


  }


  async createMessage( createMessageDto: CreateMessageDto, res) {
    const message = await this.messagesRepository.create(createMessageDto);
    if(!message) {
      return res.status(400).send({message: 'Error creating message'});
    }
    else {
      return res.status(201).send(message);
    }
  }


  async getMessagesByChat(chatId: string , res) {
    const messages = await  this.messagesRepository.getMessagesByChat(chatId);
    if(!messages) {
      return res.status(400).send({message: 'Error getting messages'});
    }
    else {
      return res.status(200).send(messages);
    }
  }


  async getLastMessageByChat(chatId: string) {
    const messages = await this.messagesRepository.getMessagesByChat(chatId);
  
    if (!messages || messages.length === 0) {
      throw new BadRequestException('No messages found');
    } else {
      // Sort messages by the createdAt property in ascending order
      messages.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
      const lastMessage = messages[messages.length - 1];
      return lastMessage
  }
  
}


}

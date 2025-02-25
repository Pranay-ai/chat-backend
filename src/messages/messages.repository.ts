import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './messages.schema';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/common/db-mongoose/db-mongo.respository';

@Injectable()
export class MessagesRepository extends AbstractRepository<Message> {
  constructor(
    @InjectModel(Message.name) private messagesModel: Model<Message>,
  ) {
    super(messagesModel);
  }

  async getMessagesByChat(chatId : string){
    return this.messagesModel.find({chatId}).exec();
  }


}




import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DbMongoModule } from 'src/common/db-mongoose/db-mongo.module';
import { Message, MessageSchema } from './messages.schema';
import { MessagesRepository } from './messages.repository';

@Module({
  imports: [DbMongoModule.forFeature([{ name: Message.name , schema : MessageSchema }])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}

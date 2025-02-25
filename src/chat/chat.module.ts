import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DbMongoModule } from 'src/common/db-mongoose/db-mongo.module';
import { Chat, ChatSchema } from './chat.schema';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [DbMongoModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository ],
  exports: [ChatService],
})
export class ChatModule {}

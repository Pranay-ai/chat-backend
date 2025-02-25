import { Module } from '@nestjs/common';
import { ChatGatewayService } from './chat-gateway.service';
import { ChatGatewayGateway } from './chat-gateway.gateway';
import { RedisService } from '../common/utilities/redis.service';
import { ConfigService } from '@nestjs/config';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports:[ChatModule],
  providers: [
    ChatGatewayGateway, 
    ChatGatewayService, 
    RedisService,
    ConfigService,
  ],
})
export class ChatGatewayModule {}

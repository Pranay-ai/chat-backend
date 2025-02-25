import { Injectable } from '@nestjs/common';
import { CreateChatGatewayDto } from './dto/create-chat-gateway.dto';
import { UpdateChatGatewayDto } from './dto/update-chat-gateway.dto';

@Injectable()
export class ChatGatewayService {
  create(createChatGatewayDto: CreateChatGatewayDto) {
    return 'This action adds a new chatGateway';
  }

  findAll() {
    return `This action returns all chatGateway`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatGateway`;
  }

  update(id: number, updateChatGatewayDto: UpdateChatGatewayDto) {
    return `This action updates a #${id} chatGateway`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatGateway`;
  }
}

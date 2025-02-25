import { Controller, Get, Post, Body, Patch, Param, Delete, Response } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';


@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chatId: { type: 'string' },
        senderId: { type: 'string' },
        content: { type: 'string' },
      },
    },
  })
  async createMessage(@Body() createMessageDto: CreateMessageDto , @Response() res) {
    return this.messagesService.createMessage(createMessageDto, res);
  }


  @Get(':chatId')
  async getMessagesByChat(@Param('chatId') chatId: string, @Response() res) {
    return this.messagesService.getMessagesByChat(chatId, res);
  }


}

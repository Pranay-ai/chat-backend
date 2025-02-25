import { Body, Controller, Delete, Get, Param, Patch, Post, Response } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChatDto';
import { ApiBody } from '@nestjs/swagger';
import { UpdateChatDto } from './dto/updateChatDto';
import { LeaveChatDto } from './dto/leaveChatDto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-chat')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        createdBy: { type: 'string' },
        name: { type: 'string' },
        isPrivate: { type: 'boolean' },
        userIds: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  async createChat(@Body() createChatDto: CreateChatDto, @Response() res) {
    return this.chatService.createChat(createChatDto , res);
  }


@Get(':userId')
async getChats(@Param('userId') userId: string, @Response() res) {
  return this.chatService.getChatsByUser(userId, res);
}

@Patch(':chatId')
@ApiBody({ type: UpdateChatDto })
async updateChat(@Param('chatId') chatId: string, @Body() updateChatDto: UpdateChatDto, @Response() res) {
  return this.chatService.updateChat(chatId, updateChatDto, res);
}

@Delete(':chatId')
async deleteChat(@Param('chatId') chatId: string, @Response()  res) {
  return this.chatService.deleteChat(chatId, res);
}

@Patch(':chatId/leave')
@ApiBody({ type: LeaveChatDto })
async leaveChat(@Param('chatId') chatId: string, @Body() leaveChatDto: LeaveChatDto, @Response() res) {
  return this.chatService.removeUserFromChat(chatId, leaveChatDto.userId, res);
}

  
}

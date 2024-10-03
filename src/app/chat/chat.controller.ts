import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { createPostDto } from "../post/dto/create-post.dto";
import { ChatDto } from "./dto/createchat.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guards";
import { createGroupDto } from "./dto/creategroup.dto";

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ChatController{
    constructor(private chatService:ChatService){}
    @Get()
    getChat(){
        return this.chatService.getChat()
    }
    @Get(':chatId')
    getChatMessage(@Param('chatId') chatId:number){
        return this.chatService.getChatMessages(chatId)
    }
    @Post()
    findChat(@Body() body:ChatDto){
        return this.chatService.sendMessage(body)
    }
    @Post('/groups')
    createGroup(@Body() body:createGroupDto){
        return this.chatService.createGroup(body)
    }
}

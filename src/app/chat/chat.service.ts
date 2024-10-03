import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from 'src/database/entities/Chat.entity';
import { MessageEntity } from 'src/database/entities/Message.entity';
import { In, Repository } from 'typeorm';
import { createPostDto } from '../post/dto/create-post.dto';
import { ChatDto } from './dto/createchat.dto';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/database/entities/User.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createGroupDto } from './dto/creategroup.dto';

@Injectable()
export class ChatService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(ChatEntity)
    private chatRepo: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    private cls: ClsService,
  ) {}
  findById(id: number) {
    return this.chatRepo.findOne({
      where: { id },
      relations: ['participant', 'participant.user'],
    });
  }
  async getChat() {
    const myUser = await this.cls.get<UserEntity>('user');
    let chats = await this.chatRepo.find({where:{participant:{user:{id:myUser.id}}},relations:['participant', 'participant.user','lastMessage','lastMessage.sender']})
    return chats.map(chat=>{
      let myparticipants =  chat.participant.find(p=>p.user.id === myUser.id)
      return {
        ...chat,
        unreadCount: myparticipants ? myparticipants.unreadCount : 0,
        everyRead: !chat.participant.find((p) => p.unreadCount > 0),
        participant: undefined,
      };
    
    })
    
    
    

    

  }

  async getChatMessages(chatId: number) {
    const myUser = await this.cls.get<UserEntity>('user');

    const chats = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['participant', 'participant.user'],
    });

    let chat = await chats.participant.find((p) => p.user.id === myUser.id);
    chat.unreadCount = 0;
    if (!chat) {
      throw new NotFoundException('chat is not found ');
    }
    const messages = await this.messageRepo.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
    });
    messages.forEach((message) => {
      if (!message.readBy.includes(myUser.id)) {
        message.readBy.push(myUser.id);
      }
    });
    await Promise.all([chat.save(), this.messageRepo.save(messages)]);
    return messages;
  }

  async findChat(params: { userId?: number; chatId?: number }) {
    let { userId, chatId } = params;
    let myUser = await this.cls.get<UserEntity>('user');
    if (myUser.id === userId)
    throw new BadRequestException('You can not send message to yourself');
  let chat: ChatEntity;
  let isNew = false;
    if (userId) {
      const chats = await this.chatRepo.find({
        where: [
          { isGroup: false, participant: { user: { id: myUser.id } } },
          { isGroup: false, participant: { user: { id: userId } } },
        ],
        relations: ['participant', 'participant.user'],
      });
      chat = chats.find((c) => {
        const participants = c.participant.map((p) => p.user.id);
        return (
          participants.includes(myUser.id) && participants.includes(userId)
        );
      });

      if (!chat) {
        chat = await this.chatRepo.create({
          isGroup: false,
          participant: [{ user: { id: myUser.id } }, { user: { id: userId } }],
        });
        await this.chatRepo.save(chat);
        isNew = true;
        
      }
    } else if (chatId) {
      chat = await this.chatRepo.findOne({
        where: { id: chatId },
        relations: ['participant', 'participant.user'],
      });
      if (
        !chat ||
        !chat.participant.find(
          (participant) => participant.user.id === myUser.id,
        )
      )
        throw new NotFoundException();
    }
    return {chat, isNew};
  }

  async sendMessage(params: ChatDto) {

    let { userId, chatId } = params;
    const myUser = await this.cls.get<UserEntity>('user');
    const {chat,isNew} = await this.findChat({ userId, chatId });

    if (!chat) {
      throw new NotFoundException();
    }
    let messages = this.messageRepo.create({
      chat: { id: chat.id },
      message: params.messages,
      readBy: [myUser.id],
      sender: { id: myUser.id },
    });

    await messages.save();
    chat.lastMessage = { id: messages.id } as MessageEntity;
    chat.participant.map((participant) => {
      if (participant.user.id === myUser.id) {
        return participant;
      } else {
        participant.unreadCount++;
      }
    });
    await chat.save();
    if(isNew){
      this.eventEmitter.emit('chat.create', {chat,messages});
      
    }else{
      this.eventEmitter.emit('chat.update', {chat,messages});
      
    }
    this.eventEmitter.emit('message.create', { chat, messages });

    return { 
      message:"send message successfully"
     };

  }
  async createGroup(body:createGroupDto){
    let {userId,name} = body
    let myUser = await this.cls.get<UserEntity>("user")
    let groupchat = await this.chatRepo.create({
      isGroup: true,
      name,
      participant:[...userId,myUser.id].map(id=>({
        user:{
          id
        }
      })) 
    })
    await groupchat.save()
    return groupchat
  }

}

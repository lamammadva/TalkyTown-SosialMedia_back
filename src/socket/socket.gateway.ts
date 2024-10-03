import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotFoundError } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/app/chat/chat.service';
import { UserService } from 'src/app/user/user.service';
import { ChatEntity as ChatEntity } from 'src/database/entities/Chat.entity';
import { MessageEntity } from 'src/database/entities/Message.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private chatService: ChatService,
  ) {}
  @SubscribeMessage('auth')
  async handleAuth(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const token = body?.token;
    try {
      let payload = this.jwtService.verify(token);
      if (!payload.userId) throw new Error('user is not found');
      let user = await this.userService.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new Error('user is not found');
      }
      client.data.user = user;
      client.emit('auth', {
        status: true,
        userId: user.id,
        message: 'user id succesfully logged in',
      });
    } catch (error: any) {
      client.emit('auth', { status: false, error: error?.message });
    }
  }

  //   @SubscribeMessage('chat')
  //   handleMessage(@MessageBody() body: any) {
  //     console.log(body);
  //   }

  @SubscribeMessage('writing')
  async writingStatus(
    @MessageBody() body: { chatId: number; status: boolean },
    @ConnectedSocket() client: Socket,
    
  ) {
    
    const {chatId = 0,status} = body
    const user =  client.data?.user
    const userId = user?.id
    console.log(userId);
    
    if(!userId) return 
    let chat = await this.chatService.findById(chatId)
    console.log(chat);
    

    if(!chat.participant.find((p)=>p.user.id === userId)) return 
    let participants =  chat.participant.filter(p=>p.user.id != userId)
    let sockets = await this.server.fetchSockets()
    for (let participant of participants) {
        let participantSocket = sockets.find(socket=> socket.data?.user?.id === participant.user.id)
        console.log(participantSocket);
        
        if (participantSocket){
          participantSocket.emit('writing', { userId,username:user.username, status });

        }
        
    }

  }

  @OnEvent('message.create')
  async handleMessageCreate(payload: {
    chat: ChatEntity;
    messages: MessageEntity;
  }) {
    const { chat, messages } = payload;
    
    let receivers = chat.participant.filter(
      (p) => p.user.id != messages.sender.id,
      
      );
    let sockets = await this.server.sockets.fetchSockets();
    
    for (let receiver of receivers) {
      let receiverSocket = sockets.find(
        (socket) => socket.data?.user?.id === receiver.user.id,
        
        );
      if (receiverSocket) {
        receiverSocket.emit('message.create', messages);
      }
    }
  }

  @OnEvent('chat.create')
  async handleChatCreate(payload:{chat:ChatEntity;messages:MessageEntity}){
    const {chat,messages} = payload
    let participants = chat.participant.filter((p)=>p.user.id !=messages.sender.id)
    let sockets = await this.server.fetchSockets()
    for (let participant of participants){
      let socket = sockets.find((socket)=>socket.data.user?.id === participant.user.id)
      if(socket) {
        socket.emit('chat.create' , chat)

      }else {
        console.log(`Socket for participant ${participant.user.id} not found.`);
      }

    }

  }
  @OnEvent('chat.update')
  async handleChatUpdate(payload:{chat:ChatEntity;messages:MessageEntity}){
    const {chat,messages} = payload
    let participants = chat.participant.filter((p)=>p.user.id !=messages.sender.id)
    let sockets = await this.server.fetchSockets()
    for (let participant of participants){
      let socket = sockets.find((socket)=>socket.data.user?.id === participant.user.id)
      if(socket) {
        socket.emit('chat.update', chat)

      }else {
        console.log(`Socket for participant ${participant.user.id} not found.`);
      }

    }

  }
}

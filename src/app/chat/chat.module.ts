import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "src/database/entities/Message.entity";
import { ChatEntity as ChatEntity } from "src/database/entities/Chat.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ChatEntity,MessageEntity])],
    controllers: [ChatController],
    providers: [ChatService],
    exports: [ChatService]
})

export class ChatModule {}
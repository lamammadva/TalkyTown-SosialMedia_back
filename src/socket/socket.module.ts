import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { UserModule } from "src/app/user/user.module";
import { ChatModule } from "src/app/chat/chat.module";

@Module({
    imports:[ChatModule],
    providers:[SocketGateway]
})
export class SocketModule{}
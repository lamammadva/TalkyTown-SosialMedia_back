import { Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/User.entity";
import { FollowModule } from "../follow/follow.module";
@Global()
@Module({
    imports:[TypeOrmModule.forFeature([UserEntity]),FollowModule],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})
export class UserModule{
    
}
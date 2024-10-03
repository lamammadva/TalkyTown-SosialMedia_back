import { Module, forwardRef } from "@nestjs/common";
import { FollowController } from "./follow.controlller";
import { FollowService } from "./follow.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/Follow.entity";
import { UserModule } from "../user/user.module";

@Module({
    imports:[TypeOrmModule.forFeature([FollowEntity]),forwardRef(() => UserModule)],
    controllers:[FollowController],
    providers:[FollowService],
    exports:[FollowService],
})
export class FollowModule{

}
import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "src/database/entities/Post.entity";
import { PostController } from "./post.controller";
import { RedisModule } from "src/shared/libs/redis/redis.module";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]),RedisModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}

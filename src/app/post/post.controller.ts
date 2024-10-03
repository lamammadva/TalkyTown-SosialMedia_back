import { Body, Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { createPostDto } from "./dto/create-post.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guards";
import { ClsService } from "nestjs-cls";
import { UserEntity } from "src/database/entities/User.entity";
import { getUserPostDto } from "./dto/user-post.dto";
import { ProfileGuard } from "../guards/profile.guards";
import { FindUserParams } from "src/shared/types/find.types";
import { PostEntity } from "src/database/entities/Post.entity";

@Controller('post')
@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PostController{
    constructor(private postService:PostService,private cls:ClsService){

    }
    
    @Get()
    myPost(@Query() params:FindUserParams<PostEntity>){
        return this.postService.find(params)
    }
    @UseGuards(ProfileGuard)
    @Get('user/:userId')
    userPost(@Param('userId') userId:number, @Query() query:getUserPostDto){
        return this.postService.userFind(userId,query)
    }
    @Post()
    createPost(@Body() body:createPostDto){
        return this.postService.createPost(body)
    }
    @Get('like')
    async getLike(){
        const myUser = await this.cls.get<UserEntity>('user')
        return this.postService.getLike(myUser.id)
    }
    @Post('user/:userId/like/:postId')
    @UseGuards(ProfileGuard)
    likePost(@Param('postId') postId:number,@Param('userId') userId:number){
        return this.postService.likePost(postId,userId)

    }

}
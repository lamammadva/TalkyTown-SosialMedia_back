import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { ClsService } from "nestjs-cls";
import { FollowDto } from "./dto/create-follow.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guards";

@Controller('follow')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Follow')
export class FollowController{
    constructor(private followService:FollowService){}

    @Post()
    createFollow(@Body() body:FollowDto){
        return this.followService.createFollow(body)
    }

    @Post("/accept/:userid")
    acceptFollow(@Param('userid') userid:number){
        return this.followService.acceptFollow(userid)

    }

    @Post("reject/:userid")
    rejectFollow(@Param('userid') userid:number){
        return this.followService.rejectFollow(userid)

    }

    @Delete("/unfollow/:userid")
    unFollow(@Param('userid') userid:number){
        return this.followService.unFollow(userid)

    }
    @Delete("/remove/:userid")
    removeFollow(@Param('userid') userid:number){
        return this.followService.removeFollow(userid)

    }
    @Get('request')
    followRequest(){
        return this.followService.followRequests()
    }



}



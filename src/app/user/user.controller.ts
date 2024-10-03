import { Body, Controller, Get, NotFoundException, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guards";
import { Request } from "express";
import { AuthRequest } from "src/shared/interface/auth.interface";
import { SearchUserDto } from "./dto/search-user.dto";
import { ClsService } from "nestjs-cls";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserEntity } from "src/database/entities/User.entity";
@Controller("user")
@ApiTags("User")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController{
   
    constructor(private userService:UserService,private cls:ClsService){   }
  
    @Get('/profile')
    async myProfile(){
        let user = await this.cls.get<UserEntity>("user")
        return  this.userService.findOne({where:{id:user.id}})
    }
    @Get('profile/:id')
    async userProfile(@Param('id') id:number){
        let  user= await this.userService.userProfile(id)
        if(!user){
            throw new NotFoundException()
        } 
        return user
        
    }
    @Post('profile')
    updateProfile(@Body() body:UpdateProfileDto){
        return  this.userService.updateProfile(body)
       

    }

    @Get('search')
    async search(@Query() query:SearchUserDto){
        return this.userService.search(query)
        
    }

}
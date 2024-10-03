import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "../user/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guards";
import { ForgetPasswordDto } from "./dto/forgetpassword.dto";
import { resetPasswordDto } from "./dto/resetpassword.dto";
import { join } from "path";
import { Response } from "express";
@Controller("auth")
@ApiTags("Auth")

export class AuthController{
    constructor(private authService:AuthService){}

    @Post('register')
    register(@Body() body:UserDto){
        return this.authService.register(body)
    }
    @Post('login')
    login(@Body() body:LoginDto){
        return this.authService.login(body)
    }
    @Get('forget_password')
    getforgetpassword(@Res() res:Response){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(join(__dirname,'../../templates/reset-password.hbs'))
        
        
    }
    @Post('forget_password')
    forgetpassword(@Body() body:ForgetPasswordDto){
        return this.authService.forgetPassword(body)
    }
    @Post("reset_password")
    resetPassword(@Body() body:resetPasswordDto){
        return this.authService.resetPassword(body)

    }


}
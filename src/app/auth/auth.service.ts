import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { UserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { registerDto } from "./dto/register.dto";
import { UserRole } from "src/shared/enum/user.enum";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import * as dateFns from "date-fns"
import { MailerService } from "@nestjs-modules/mailer";
import { ForgetPasswordDto } from "./dto/forgetpassword.dto";
import { resetPasswordDto } from "./dto/resetpassword.dto";
import config from "src/config";
@Injectable()
export class AuthService{
    constructor(private userService:UserService, private jwtService: JwtService,private mailerService:MailerService){

    }
    async register(body:registerDto){

        const user =  await this.userService.create({...body ,role:[UserRole.USER]})
        try {
            await this.mailerService.sendMail({
                to:user.email,
                subject:'Welcome to Tolkytown',
                template:'register',
                context:{
                    fullName:user.fullName
                }

            })
        } catch (error) {
            console.log('email send error',error);
            
            
        }
        return user

    }

    async login(body:LoginDto){
        let user = await this.userService.findOne({where:[
            {username:body.username},
            {email:body.username}
        ]})
        if(!user){
            throw new HttpException('user is wrong',HttpStatus.BAD_REQUEST)
        }
        let checkPassword = await bcrypt.compare(body.password,user.password)
        if(!checkPassword){
            throw new HttpException('password is wrong',HttpStatus.BAD_REQUEST)
        }
        let payload = {
            userId:user.id,


        }
        console.log(user);
        let token = this.jwtService.sign(payload)
        return {
            token,user
        }
        

        
    }
    async forgetPassword(body:ForgetPasswordDto){
       const  user = await this.userService.findOne({where:{email:body.email}})
       if(!user){
        throw new NotFoundException()
       }
       let activateToken = crypto.randomBytes(12).toString('hex')
       let activateExpire = dateFns.addMinutes(new Date(),30)
       await this.userService.update(user.id,{activateToken,activateExpire})
       await this.mailerService.sendMail({
        to:user.email,
        template:"forget-password",
        subject:"forgetPassword",
        context:{
            fullName:user.fullName,
            url:`${config.app_url}/auth/forget_password?token=${activateToken}&email=${user.email}`
        }

       })
       return {
        status:true,
        message:"email has been send",
        token:activateToken

       }
    }
    async resetPassword(body:resetPasswordDto){
        const user = await this.userService.findOne({where:{email:body.email}})
        
        if(!user){
            throw new NotFoundException()
        }
        
        if(user.activateToken!==body.token){
            throw new HttpException('token is wrong',400)
        }
        if(user.activateExpire <new Date()){
            throw new HttpException('activated token is expired',400)
        }
        if(body.password !==body.confirm_password){
            throw new HttpException('password is not same as repeatPassword', 400);
        }
        let password = await bcrypt.hash(body.password, 10);
        await this.userService.update(user.id,{
            password,
            activateToken:null,
            activateExpire:null
        })

        
        
        
    }

}
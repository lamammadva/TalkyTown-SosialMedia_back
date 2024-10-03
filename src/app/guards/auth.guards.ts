import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ClsService } from "nestjs-cls";


@Injectable()
export class AuthGuard  implements CanActivate{
       constructor(private userService:UserService,private jwtService:JwtService, private cls:ClsService){}
    async canActivate(context: ExecutionContext):Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization.split(' ')[1]
        
        if (!token){
            throw new UnauthorizedException()
        }
        try {
            const payload = this.jwtService.verify(token)
            
            request.userId = payload.userId
            if(!payload.userId){throw new Error()}
            const user = await this.userService.findOne({where:{id:payload.userId},relations:['post']})
            if(!user){
                throw new Error()
            }
            
            this.cls.set('user',user)
            return true
        } catch (error) {
            throw new UnauthorizedException()
            
        }



        
        
        
    }
       
    
}


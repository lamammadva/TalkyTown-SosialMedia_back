import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, isEmail } from "class-validator";

export class ForgetPasswordDto{
    @Type()
    @IsEmail()
    @ApiProperty({default:'___.@gmail.com'})
    email:string
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class resetPasswordDto{
    
    @Type()
    @IsString()
    @ApiProperty()
    password:string;

    @Type()
    @IsEmail()
    @ApiProperty({nullable: true})
    email:string;

    @Type()
    @IsString()
    @ApiProperty({nullable: true})
    @MinLength(10)
    token:string;

    @Type()
    @IsString()
    @ApiProperty()
    confirm_password:string;
}
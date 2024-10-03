import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString, Length, MaxDate } from "class-validator";
import { UserGender, UserRole } from "src/shared/enum/user.enum";
import * as dateFns from 'date-fns'

export class UserDto{
    @Type()
    @IsString()
    @Length(3,20)
    @ApiProperty()
    firstname: string;

    @Type()
    @IsString()
    @Length(3,30)
    @ApiProperty()
    lastname: string;

    @Type()
    @IsString()
    @ApiProperty()
    username: string;

    @Type()
    @IsString()
    @ApiProperty()
    email: string;

    @Type()
    @IsString()
    @Length(3,100)
    @ApiProperty()
    password: string;

    @Type()
    @IsEnum(UserGender)
    @ApiProperty({enum: UserGender  })
    gender: UserGender;
  
    @Type()
    @IsEnum(UserRole,{each: true})
    @ApiProperty({default:[UserRole.USER] })
    role: UserRole[];
    

    @Type()
    @IsDate()
    @ApiProperty()
    @MaxDate(()=>dateFns.add(new Date(),{years:-10}),{
        message:"you are  young "
    })
    birthDate: Date;
    
    
} 
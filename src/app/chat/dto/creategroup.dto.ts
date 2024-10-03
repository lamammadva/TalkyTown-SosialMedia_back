import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, Length, isNumber } from "class-validator";

export class createGroupDto{
    @Type()
    @ApiProperty()
    @IsNumber({} ,{each:true})
    userId:number[]
    @Type()
    @ApiProperty()
    @IsString()
    @Length(3,50)
    name:string
}
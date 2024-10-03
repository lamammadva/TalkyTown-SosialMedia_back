import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ChatDto{
    @Type()
    @IsNumber()
    @ApiProperty({required: false})
    @IsOptional()
    userId:number
    @Type()
    @IsNumber()
    @ApiProperty({required: false})
    @IsOptional()
    chatId:number;

    @Type()
    @IsString()
    @ApiProperty({required: false})
    @IsOptional()
    messages:string;
}
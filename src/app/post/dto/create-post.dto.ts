import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString} from "class-validator";

export class createPostDto{
    @Type()
    @IsNumber({},{each: true})
    @IsArray()
    @ApiProperty({default:[]})
    images:number[]

    @Type()
    @IsString()
    @ApiProperty()
    description:string

}
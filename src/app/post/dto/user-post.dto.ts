import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class getUserPostDto{
    @Type(()=>Number)
    @ApiProperty({default:0})
    @Min(0)
    @IsOptional()
    @IsNumber()
    page:number

    @Type(()=>Number)
    @ApiProperty({default:10})
    @Min(5)
    @IsOptional()
    @Max(20)
    @IsNumber()
    limit:number

}
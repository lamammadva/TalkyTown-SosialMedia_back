import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length, Max, Min, MinLength } from "class-validator";

export class SearchUserDto{
    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    searchParam :string
    @Type()
    @IsNumber()
    @ApiProperty({required: false})
    @Min(0)
    @Max(50)
    @IsOptional()
    limit: number;
    @Type()
    @IsNumber()
    @Min(0)
    @IsOptional()
    @ApiProperty({required: false})
    page: number;



}
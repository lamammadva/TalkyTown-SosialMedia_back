import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';
export class UpdateProfileDto extends PickType(PartialType(UserDto), [
  'firstname',
  'lastname',
  'username',
  'birthDate',
]) {
  @Type()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({default:false,required:false})
  isPrivate : boolean;

  @Type()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  profilePictureId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  coverImageId: number;


  @Type()
  @IsString()
  @IsOptional()
  @ApiProperty()
  @Length(0,500)
  bio: string;


}

import { OmitType } from "@nestjs/swagger";
import { UserDto } from "src/app/user/dto/create-user.dto";

export class registerDto extends OmitType(UserDto,['role']){

}
import { PickType } from "@nestjs/swagger";
import { UserDto } from "src/app/user/dto/create-user.dto";




export class LoginDto extends PickType(UserDto,[
    'username',
    'password'
]){}
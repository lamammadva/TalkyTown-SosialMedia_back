import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/database/entities/User.entity';
import { FindOptionsSelect } from 'typeorm';
import { FollowStatus } from 'src/shared/enum/follow.enum';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private cls: ClsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let userId = Number(request.params.userId || request.query.userId);
    if (!userId) {
      throw new NotFoundException();
    }
   
    const myUser = await this.cls.get<UserEntity>('user');
    if(myUser.id === userId) return true
    const user = await this.userService.findOne({
      where: [
        { id: userId, isPrivate: false },
        { id: userId, myfollower: {status:FollowStatus.FOLLOWING, following: { id: myUser.id } } },
      ],
      select:{id:true},
      relations: ['myfollower', 'myfollower.following'],
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return true;
  }
}

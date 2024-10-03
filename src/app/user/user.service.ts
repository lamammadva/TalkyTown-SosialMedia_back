import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/User.entity';
import { FindOptionsWhere, Repository, FindManyOptions, ILike, Not } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { SEARCH_PROFILE_SELECTED, SEARCH_USER_SELECTED } from './user-select';
import { ClsService } from 'nestjs-cls';
import { FollowStatus } from 'src/shared/enum/follow.enum';
import { FindUserParams } from 'src/shared/types/find.types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FollowService } from '../follow/follow.service';
// export type UserKey = keyof UserEntity;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @Inject(forwardRef(() => FollowService))
    private followService: FollowService,
    private cls: ClsService,
  ) {}
  find(params: FindUserParams<UserEntity>) {
    const { where, select, limit, page, relations } = params;
    let payload: FindManyOptions<UserEntity> = { where, select, relations };
    if (limit > 0) {
      payload.take = limit;
      payload.skip = limit * page;
    }
    return this.userRepo.find(payload);
  }
  findOne(params: Omit<FindUserParams<UserEntity>, 'limit' | 'page'>) {
    let { where, select, relations } = params;
    return this.userRepo.findOne({ where, select, relations });
  }
  async userProfile(id: number) {
    let myUser = await this.cls.get<UserEntity>('user');
    const relations = ['myfollower', 'myfollower.following','post'];

    const user = await this.findOne({
      where: { id },
      relations,
      select: SEARCH_PROFILE_SELECTED,
    });
    console.log(user.myfollower);

    if (!user) throw new NotFoundException('User is not found');
    const followStatus = user.myfollower.find((follow) => follow.following.id == myUser.id)?.status || FollowStatus.NOT_FOLLOWING;
    const result = { ...user, followStatus, myfollower: undefined };

    return result;
  }

  async create(body: UserDto) {
    let checkuser = await this.findOne({ where: { username: body.username } });
    if (checkuser) {
      throw new ConflictException('User already exists');
    }
    let checkemail = await this.findOne({ where: { email: body.email } });
    if (checkemail) {
      throw new ConflictException('Email address already exists');
    }
    let user = this.userRepo.create(body);
    await user.save();
    return user;
  }
  async update(id: number, body: Partial<UserEntity>) {
    return await this.userRepo.update(id, body);
  }
  async search(params: SearchUserDto) {
    const myUser = await this.cls.get<UserEntity>('user');
    const { searchParam, page = 0, limit = 10 } = params;
    let where: FindOptionsWhere<UserEntity>[] = [
      {
        username: ILike(`${searchParam}%`),
      },
      {
        email: searchParam,
      },
      {
        firstname: ILike(`%${searchParam}%`),
      },
      {
        lastname: ILike(`%${searchParam}%`),
      },
    ];
    const relations = ['myfollower', 'myfollower.following'];
    let users = await this.find({
      where,
      limit,
      page,
      select: SEARCH_USER_SELECTED,
      relations,
    });

    let mapUser = users.map((user) => {
      let followStatus =
        user.myfollower.find((follow) => follow.following.id == myUser.id)
          ?.status || FollowStatus.NOT_FOLLOWING;
      return {
        ...user,
        followStatus,
        myfollower: undefined,
      };
    });
    return mapUser;
  }
  async updateProfile(params:Partial<UpdateProfileDto>){
    let myUser = await this.cls.get<UserEntity>('user');
    let payload : Partial<UserEntity>={}
    for (let key in params ){
      switch (key) {
        case 'isPrivate':
          payload.isPrivate = params.isPrivate
          if(params.isPrivate == false){
            this.followService.acceptallrequest(myUser.id)
            myUser.followerCount++
            await myUser.save()
          }
          break;
        case 'profilePictureId':
          payload.profilePicture = {
            id: params.profilePictureId,
          };
          break;
        
        case 'email':
        case 'username':
          let checkUser = await this.findOne({where:{username:params.username,id:Not(myUser.id)}})
          if(checkUser){
            throw new ConflictException('This username already exists')
          }
          payload.username = params.username
          break;
          case 'coverImageId':
            payload.coverImage = {
            id: params.coverImageId,
          }
        break;
      
        default:
          payload[key]=params[key]
          break;
      }

    }



    await  this.update(myUser.id,payload)
    return {
      status:true,
      message:"successfuly update"
    }

  }
}
function acceptallrequest() {
  throw new Error('Function not implemented.');
}


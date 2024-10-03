import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from 'src/database/entities/Follow.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FollowDto } from './dto/create-follow.dto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/database/entities/User.entity';
import { UserService } from '../user/user.service';
import { FollowStatus } from 'src/shared/enum/follow.enum';
import { FindUserParams } from 'src/shared/types/find.types';
import { FOLLOW_REQUEST_SELECTED } from './follow.select';
import { NotFoundError } from 'rxjs';
@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepo: Repository<FollowEntity>,
    private cls: ClsService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  find(params: FindUserParams<FollowEntity>) {
    let { where, select, relations } = params;
    return this.followRepo.find({ where, select, relations });
  }
  findOne(params: Omit<FindUserParams<FollowEntity>, 'limit' | 'page'>) {
    let { where, select, relations } = params;
    return this.followRepo.findOne({ where, select, relations });
  }
  async sameFunc(userid:number){
    let myUser = await this.cls.get<UserEntity>('user');
    let user = await this.userService.findOne({ where: { id: userid } });
    
    if (!user){
      throw new NotFoundException()
    }
  }
  async createFollow(body: FollowDto) {
    let myUser = await this.cls.get<UserEntity>('user');
    let user = await this.userService.findOne({ where: { id: body.userId } });
    if (!user){
      throw new BadRequestException()
    }
    if(user.id === myUser.id) throw new BadRequestException()
    let checkUser = await this.findOne({
      where: { followers: { id: user.id }, following: { id: myUser.id } },
    });
    if (checkUser) {
      throw new ConflictException('You already follow this user');
    }
    let follow = this.followRepo.create({
      followers: {id: user.id},
      following: {id: myUser.id},
      status: user.isPrivate ? FollowStatus.WAITING : FollowStatus.FOLLOWING,
    });
    if (!user.isPrivate) {
      user.followerCount++;
      myUser.followedCount++;
      await Promise.all([user.save(), myUser.save()]);
    }
    await follow.save();
    return follow;
  }
  async acceptFollow(userid: number) {
    let myUser = await this.cls.get<UserEntity>('user');
    let user = await this.userService.findOne({ where: { id: userid } });
    if (!user){
      throw new NotFoundException()
    }
    let follow = await this.findOne({
      where: { followers: { id: myUser.id }, following: { id: user.id } },
    });
    
    if (!follow) {
      throw new ConflictException('No follow request found');
    }
    if (follow.status !== FollowStatus.WAITING)
      throw new BadRequestException('you have already accepted this request ');
    follow.status = FollowStatus.FOLLOWING;

    myUser.followerCount++;
    user.followedCount++;
    await Promise.all([follow.save(),user.save(), myUser.save()]);
    
    return {
      status: true,
      message: 'you have accepted follow request',
    };
  }
  async removeFollow(userid: number) {
    let myUser = await this.cls.get<UserEntity>('user');
    let user = await this.userService.findOne({ where: { id: userid } });
    if (!user){
      throw new BadRequestException()
    }
    let follow = await this.findOne({
      where: { followers: { id: myUser.id }, following: { id: user.id } },
    });
    if (!follow) {
      throw new ConflictException('No follow request found');
    }
    if (follow.status == FollowStatus.FOLLOWING) {
      myUser.followerCount--;
      user.followedCount--;
      await Promise.all([myUser.save(), user.save()]);
    }
    await follow.remove();
    return {
      status: true,
      message: 'remove successfully',
    };
  }
  async unFollow(userid: number) {
    let myUser = await this.cls.get<UserEntity>('user');
    let user = await this.userService.findOne({ where: { id: userid } });
    if (!user){
      throw new BadRequestException()
    }
    let follow = await this.findOne({
      where: { followers: { id: user.id }, following: { id: myUser.id } },
    });
    if (!follow) {
      throw new ConflictException('No follow request found');
    }
    if (follow.status == FollowStatus.FOLLOWING) {
      user.followerCount--;
      myUser.followedCount--;
      await Promise.all([myUser.save(), user.save()]);
    }
    await follow.remove();
    return{
      status:true,
      message:"unfolow succesfully"
    }
  }
  async rejectFollow(userid: number) {
    let myUser = await this.cls.get<UserEntity>('user');
    let user = await this.userService.findOne({ where: { id: userid } });
    
    if (!user){
      throw new NotFoundException()
    }
    let follow = await this.findOne({
      where: { followers: { id: myUser.id }, following: { id: user.id } },
    });
    if (!follow) {
      throw new ConflictException('No follow request found');
    }
    if (follow.status != FollowStatus.WAITING) throw new BadRequestException();
    await follow.remove();
    return {
      status: true,
      message: 'you have rejected follow request',
    };
  }
  async followRequests() {
    let myUser = await this.cls.get<UserEntity>('user');
    return this.followRepo.find({
      where: { followers: { id: myUser.id },status:FollowStatus.WAITING },
      relations: ['following'],
      select: FOLLOW_REQUEST_SELECTED,
    });
  }
  async acceptallrequest(userId: number){
    const waiting = await this.followRepo.update(
      {
        followers:{id:userId},
        status:FollowStatus.WAITING

      },{
        status:FollowStatus.FOLLOWING


      }
      
    )
       

    
  }
}

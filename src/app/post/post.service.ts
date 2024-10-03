import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/database/entities/Post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dto/create-post.dto';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/database/entities/User.entity';
import { FindUserParams, findoOneParams } from 'src/shared/types/find.types';
import { getUserPostDto } from './dto/user-post.dto';
import { RedisService } from 'src/shared/libs/redis/redis.service';

@Injectable()
export class PostService {
  constructor(
    private redisService: RedisService,
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
    private cls: ClsService,
  ) {}
  async find(params: FindUserParams<PostEntity>) {
    let { where, select, relations, limit = 10, page=0 } = params;
    return await this.postRepo.find({
      where,
      select,
      relations:['user'],
      take: limit,
      skip: page * limit,
    });
  }

  async findOne(params: findoOneParams<PostEntity>) {
    let { where, select, relations } = params;
    return await this.postRepo.findOne({ where, select, relations });
  }
  async userFind(userId: number, params: getUserPostDto) {
    let myUser = await this.cls.get<UserEntity>("user")
    let cacheData = await this.redisService.get(`postlist${myUser.id}`);
    if(cacheData){
      console.log('Data from cache')
      return JSON.parse(cacheData)
    }
    const { limit = 10, page = 0 } = params;
    const post = await this.find({
      where: { user: { id: userId } },
      relations: ['user'],
      limit,
      page,
    });
    await this.redisService.set(`postlist${myUser.id}`,JSON.stringify(post))
    return post;
  }
  async createPost(body: createPostDto) {
    let myUser = await this.cls.get<UserEntity>('user');
    const images = body.images.map((id) => ({ id }));
    let post = await this.postRepo.create({
      ...body,
      images,
      user: {
        id: myUser.id,
      },
    });
    await post.save();
    let cachData = await this.redisService.get(`postlist${myUser.id}`)
    if(cachData){
      await this.redisService.delete(`postlist${myUser.id}`)
    }
    return {
      status: true,
      message: 'successfully',
    };
  }

  async getLike(userId: number) {
    const posts = await this.postRepo.find();
    const like = posts.filter((post) => post.likes.includes(userId));
    return like;
  }

  async likePost(postId: number, userId: number) {
    const myUser = await this.cls.get<UserEntity>('user');
    const post = await this.findOne({
      where: { id: postId, user: { id: userId } },
    });
    const cheklike = post.likes.includes(myUser.id);

    if (cheklike) {
      post.likes = post.likes.filter((userId) => userId !== myUser.id);
    } else {
      post.likes.push(myUser.id);
    }
    await post.save();
    return {
      status: true,
      message: 'successfully',
    };
  }
}

import {  Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { UserEntity } from "./User.entity";
import { FollowStatus } from "src/shared/enum/follow.enum";
@Entity()
export class FollowEntity extends CommonEntity{
    @ManyToOne(()=>UserEntity, (user)=>user.ifollowed)
    following : UserEntity

    @ManyToOne(()=>UserEntity, (user)=>user.myfollower)
    followers:UserEntity

    @Column({default:FollowStatus.WAITING})
    status: FollowStatus 
}
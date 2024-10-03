import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./User.entity";
import { ChatEntity } from "./Chat.entity";
import { CommonEntity } from "./Common.entity";

@Entity()
export class ParticipantEntity extends CommonEntity {
    @ManyToOne(()=>UserEntity,user=>user.participant)
    user:UserEntity

    @ManyToOne(()=>ChatEntity,chat=>chat.participant,{onDelete:'CASCADE'})
    chat:ChatEntity

    @Column({default:0})
    unreadCount:number

}
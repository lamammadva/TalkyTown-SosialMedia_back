import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { UserEntity } from "./User.entity";
import {  ChatEntity } from "./Chat.entity";
@Entity()
export class MessageEntity extends CommonEntity{
    @ManyToOne(()=>UserEntity)
    @JoinTable()
    sender: UserEntity;

    @Column()
    message: string;

    @Column({type: "json",default:[]})
    readBy:number[]

    @ManyToOne(()=>ChatEntity,chat=>chat.messages,{onDelete:'CASCADE'})
    chat: ChatEntity;
}
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm"
import { CommonEntity } from "./Common.entity"
import { UserEntity } from "./User.entity"
import { MessageEntity } from "./Message.entity"
import { ParticipantEntity } from "./ChatParticipant.entity"
@Entity()
export  class ChatEntity extends CommonEntity{
    @Column()
    isGroup:boolean
    @Column({nullable:true })
    name:string
    @OneToMany(()=>ParticipantEntity,participant=>participant.chat,{cascade:true})
    participant:ParticipantEntity[]

    @OneToOne(()=>MessageEntity)
    @JoinColumn({name:"lastMessageId"})
    lastMessage:MessageEntity

    @OneToMany(()=>MessageEntity,messages=>messages.chat)
    messages:MessageEntity
}
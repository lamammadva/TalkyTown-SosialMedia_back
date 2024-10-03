import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { UserGender, UserRole } from "src/shared/enum/user.enum";
import * as bcrypt from "bcrypt";
import { FollowEntity } from "./Follow.entity";
import { PostEntity } from "./Post.entity";
import { ParticipantEntity } from "./ChatParticipant.entity";
import { ImageEntity } from "./Image.entity";

@Entity()
export class UserEntity extends CommonEntity {
    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    username: string;
  
    @Column()
    email: string;

    @Column()
    birthDate: Date;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio: string;

    @OneToOne(() => ImageEntity, { eager: true })
    @JoinColumn()
    profilePicture: Partial<ImageEntity>;
  
    @OneToOne(()=>ImageEntity,{ eager: true })
    @JoinColumn()
    coverImage: Partial<ImageEntity>;;

    @Column({ type: "enum", enum: UserGender })
    gender: UserGender;

    @Column({type: "enum", enum: UserRole,array:true})
    role: UserRole[];
    
    @Column({nullable: true})
    activateToken :string

    @Column({nullable: true})
    activateExpire :Date

    @Column({default:0})
    followedCount: number

    @Column({default:0})
    followerCount: number

    @Column({default:false})
    isPrivate :boolean

    @OneToMany(()=>PostEntity, post=>post.user)
    
    post:PostEntity[]
    
    @OneToMany(()=>FollowEntity,(follow)=>follow.followers)
    myfollower:FollowEntity[]
    @OneToMany(()=>FollowEntity , (follow)=>follow.following)
    ifollowed: FollowEntity[]
    @OneToMany(()=>ParticipantEntity,participant=>participant.user)
    participant:ParticipantEntity[]

    @BeforeInsert()
    beforeInsert(){
        this.password = bcrypt.hashSync(this.password,10)
    }
    get fullName(){
        return `${this.firstname} ${this.lastname}`

    }
    

}
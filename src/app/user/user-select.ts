import { UserEntity } from "src/database/entities/User.entity"
import {FindOptionsSelect} from "typeorm"

export const SEARCH_USER_SELECTED : FindOptionsSelect<UserEntity>={
    id:true,
    firstname:true,
    lastname:true,
    username:true,

}
export const SEARCH_PROFILE_SELECTED: FindOptionsSelect<UserEntity> = {
    id: true,
    username: true,
    firstname: true,
    lastname: true,
    email:true,
   
    bio: true,
    isPrivate: true,
    followerCount: true,
    followedCount: true,
    myfollower: {
      id: true,
      status:true,
      following: {
        id: true,
      },
    },
  };
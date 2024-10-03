import { FollowEntity } from "src/database/entities/Follow.entity";
import { FindOptionsSelect } from "typeorm";

export const FOLLOW_REQUEST_SELECTED : FindOptionsSelect<FollowEntity>={
  following:{
    id:true,
    firstname:true,
    lastname:true,
    username:true,

  }
}
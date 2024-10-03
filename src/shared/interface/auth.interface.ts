import { Request } from "express";
import { UserEntity } from "src/database/entities/User.entity";

export class AuthRequest extends Request {
    user:UserEntity
}
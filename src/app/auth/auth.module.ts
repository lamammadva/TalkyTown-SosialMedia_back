import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import config from "src/config";

@Module({
    imports: [UserModule,
        JwtModule.register({
            global: true,
            secret: config.jwtsecret,
            signOptions: { expiresIn: '60d' },
        }),
    ],

    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule {

}
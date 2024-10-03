import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ClsGuard, ClsInterceptor, ClsModule } from 'nestjs-cls';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { FollowModule } from './app/follow/follow.module';
import { PostModule } from './app/post/post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadModule } from './app/upload/upload.module';
import { ChatModule } from './app/chat/chat.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from './shared/libs/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: +config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,

      entities: [`${__dirname}/**/*.entity.{ts,js}`],
      migrations: [`${__dirname}/**/migrations/*.js`],
      synchronize: true,
      logging:true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'lemanb.memmedova@gmail.com',
          pass: 'qxigqrpcggcfvskx',
        },
      },
      template: {
        dir: join(__dirname + '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    FollowModule,
    PostModule,
    UploadModule,
    ChatModule,
    SocketModule,
    RedisModule.register({host:config.redis.host,port:config.redis.port})
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClsGuard,
    },
  ],
})
export class AppModule {}

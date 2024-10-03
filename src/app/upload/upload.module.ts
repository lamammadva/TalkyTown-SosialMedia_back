import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "src/database/entities/Image.entity";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import  {extname, join} from 'path'
import { diskStorage } from "multer";

@Module({
    imports:[TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../../uploads'),
        filename: (req, file, callback) => {
          callback(
            null,
            `${Date.now()}${extname(file.originalname).toLowerCase()}`,
          );
        },
      }),
    }),
  ],
    providers:[UploadService],
    controllers:[UploadController],
})
export class UploadModule{

}



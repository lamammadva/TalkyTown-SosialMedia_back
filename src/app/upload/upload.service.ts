import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from "src/database/entities/Image.entity";
import { Repository } from "typeorm";
import { Request } from "express";
@Injectable()
export class UploadService{
    constructor(@InjectRepository(ImageEntity) private imageRepo:Repository<ImageEntity>){}

    async uploadImage(req: Request, file: Express.Multer.File) {
        let port = req.socket.localPort;
        let image = this.imageRepo.create({
          filename: file.filename,
          url: `${req.protocol}://${req.hostname}${port ? `:${port}` : ''}/uploads/${file.filename}`,
        });
    
        await image.save();
        return image;
      }
    
      async deleteImage(id: number) {
        let image = await this.imageRepo.findOne({ where: { id } });
        if (!image) throw new NotFoundException();
        return await image.remove();
      }
      async deleteImages(images: ImageEntity[]) {
        return await this.imageRepo.remove(images);
      }
    
}
import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';

@Injectable()
export class CloudinaryService {
   async upload(file: Express.Multer.File, folder: string) {
      return new Promise((resolve, reject) => {
         cloudinary.uploader.upload_stream(
            {
               folder,
               resource_type: 'image',
               transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (err, result) => {
               if (err) reject(err);
               resolve(result);
            },
         ).end(file.buffer);
      });
   }
} 

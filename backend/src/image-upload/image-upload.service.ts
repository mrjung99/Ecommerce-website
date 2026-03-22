import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { UploadedImage } from 'src/common/interfaces/upload.image.interface';
import cloudinary from 'src/configuration/cloudinary.configuration';
import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ImageUploadService {
  private readonly logger = new Logger(ImageUploadService.name);

  //* -------------------- COMPRESS IMAGE -----------------
  private async compressImage(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .resize(1500, 1500, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();
  }

  //* ------------------ UPLOAD SINGLE IMAGE -------------------
  async uploadSingleImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadedImage> {
    const compressedBuffer = await this.compressImage(file.buffer);
    const upload = await this.streamUpload(compressedBuffer, folder);
    return this.buildImageUrls(upload);
  }

  //* ------------------ UPLOAD MULTIPLE IMAGE -------------------
  async uploadMultipleImage(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<UploadedImage[]> {
    return Promise.all(
      files.map((file) => this.uploadSingleImage(file, folder)),
    );
  }

  //* ------------------ REPLACE IMAGE -------------------
  async replaceImage(
    file: Express.Multer.File,
    oldPublicId?: string,
    folder: string = 'default',
  ): Promise<UploadedImage> {
    if (oldPublicId) {
      await this.deleteImage(oldPublicId);
    }
    return this.uploadSingleImage(file, folder);
  }

  //* --------------------- STREAM UPLOAD -------------------
  private async streamUpload(
    buffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      Readable.from(buffer).pipe(stream);
    });
  }

  //* ------------------------- DELETE IMAGE --------------------
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted: ${publicId}`);
    } catch (error) {
      this.logger.warn(`Delete failed: ${error.message}`);
    }
  }

  //* --------------------- BUILD IMAGE URLS -------------------
  private buildImageUrls(upload: UploadApiResponse): UploadedImage {
    return {
      publicId: upload.public_id,
      originalUrl: upload.secure_url,

      thumbnail: cloudinary.url(upload.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        secure: true,
      }),

      medium: cloudinary.url(upload.public_id, {
        width: 600,
        height: 600,
        crop: 'fill',
        secure: true,
      }),

      large: cloudinary.url(upload.public_id, {
        width: 1200,
        height: 1200,
        crop: 'fill',
        secure: true,
      }),
    };
  }
}

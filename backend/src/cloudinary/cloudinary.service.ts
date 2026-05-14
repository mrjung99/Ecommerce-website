import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import cloudinary from '../configuration/cloudinary.configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');

    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName) {
      throw new this.logger.warn('Cloudinary cloud name is missing');
    }

    if (!apiKey) {
      throw new this.logger.warn('Cloudinary api key is missing');
    }

    if (!apiSecret) {
      throw new this.logger.warn('Cloudinary api secret is missing');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_secret: apiSecret,
      api_key: apiKey,
    });

    this.logger.log('Cloudinary configured successfully.');
  }

  //* ------------- GENERATE SIGNATURE ----------------------------
  async generateSignature(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      this.configService.get<string>('CLOUDINARY_API_SECRET') || '',
    );

    return {
      timestamp,
      signature,
      apiKey: this.configService.get<string>('CLOUDINARY_API_KEY'),
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      folder,
    };
  }

  //* ------------------------------- DELETE IMAGE -----------------------
  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted from cloudinary: ${publicId}`);

      if (res.result !== 'ok') {
        throw new Error('Image Deletion failed.');
      }
    } catch (error) {
      this.logger.log(`Cloudinary deletion failed: ${publicId}`, error);
      throw error;
    }
  }
}

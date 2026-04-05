import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import cloudinary from '../configuration/cloudinary.configuration';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  //* ------------- GENERATE SIGNATURE ----------------------------
  async generateSignature(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET || '',
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }

  //* ------------------------------- DELETE IMAGE -----------------------
  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted from cloudinary: ${publicId}`);
    } catch (error) {
      this.logger.log(`Cloudinary deletion failed: ${publicId}`);
    }
  }
}

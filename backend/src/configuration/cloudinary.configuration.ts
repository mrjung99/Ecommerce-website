import { NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('CLOUDINARY CONFIG:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
});

if (!process.env.CLOUDINARY_API_SECRET) {
  console.log('cloudinary secret key is not provided.');
} else if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.log('Cloudinary name is not provided.');
} else if (!process.env.CLOUDINARY_API_KEY) {
  console.log('Cloudinary api key is not provided.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

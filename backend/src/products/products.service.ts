import {
  BadRequestException,
  Get,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';
import cloudinary from 'src/configuration/cloudinary.configuration';
import { UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import sharp from 'sharp';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly paginationProvider: PaginationProvider,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  //* ----------------------- ADD PRODUCT ---------------------
  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    try {
      const compressed = this.compressImage(file.buffer);
      const upload = await this.streamUpload(file);

      const thumbnail_url = cloudinary.url(upload.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        secure: true,
      });

      const medium_url = cloudinary.url(upload.public_id, {
        width: 600,
        height: 600,
        crop: 'fill',
        secure: true,
      });

      const zoom_url = cloudinary.url(upload.public_id, {
        width: 1200,
        height: 1200,
        crop: 'fill',
        secure: true,
      });

      const product = this.productRepo.create({
        ...createProductDto,
        thumbnail_url,
        medium_url,
        zoom_url,
        imagePublicId: upload.public_id,
        originalUrl: upload.secure_url,
      });

      return await this.productRepo.save(product);
    } catch (error) {
      if (error) {
        console.log('UPLOAD ERROR', error);

        throw new Error();
      }
    }
  }

  // ─── Compress with sharp before upload ──────────────────────────────────
  private async compressImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(1500, 1500, {
        fit: 'inside', // preserve aspect ratio, no cropping
        withoutEnlargement: true, // don't upscale small images
      })
      .jpeg({
        quality: 80, // 80% quality — visually identical, much smaller
        progressive: true, // progressive JPEG loads faster in browser
        mozjpeg: true, // use mozjpeg encoder — better compression
      })
      .toBuffer();
  }

  // ─── Stream compressed buffer to Cloudinary ─────────────────────────────
  private streamUpload(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          use_filename: true,
          unique_filename: true,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(stream);
    });
  }

  //* ----------------------- UPDATE PRODUCT ---------------------
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    try {
      const product = await this.productRepo.findOneBy({ id });

      if (!product) {
        throw new NotFoundException('Product not found!!');
      }

      Object.assign(product, updateProductDto);

      if (file) {
        if (product.imagePublicId) {
          await this.deleteOldImage(product.imagePublicId);
        }

        const upload = await this.streamUpload(file);

        product.thumbnail_url = cloudinary.url(upload.public_id, {
          width: 300,
          height: 300,
          crop: 'fill',
          secure: true,
        });

        product.medium_url = cloudinary.url(upload.public_id, {
          height: 600,
          width: 600,
          crop: 'fill',
          secure: true,
        });

        product.zoom_url = cloudinary.url(upload.public_id, {
          width: 1200,
          height: 1200,
          crop: 'fill',
          secure: true,
        });
      }

      return await this.productRepo.save(product);
    } catch (error) {
      console.log(error);

      if (error) {
        throw new BadRequestException();
      }
    }
  }

  private async deleteOldImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted old Cloudinary asset: ${publicId}`);
    } catch (err) {
      this.logger.warn(`Could not delete asset ${publicId}: ${err.message}`);
    }
  }

  //* ----------------------- GET ALL PRODUCT ---------------------
  async getAllProduct(
    paginationDto: PaginationDto,
  ): Promise<Paginated<Product>> {
    return this.paginationProvider.paginationQuery(
      paginationDto,
      this.productRepo,
    );
  }

  //* ----------------------- GET PRODUCT BY ID ---------------------
  async getProductById(productId: string) {
    return await this.productRepo.findOneBy({ id: productId });
  }

  //* ----------------------- DELETE PRODUCT ---------------------
  async deleteProduct(productId: string) {
    return await this.productRepo.delete(productId);
  }
}

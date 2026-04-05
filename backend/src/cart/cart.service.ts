import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product } from '../products/entities/product.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  //* -------------------- GET OR CREATE CART -------------------
  async getOrCreateCart(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId } });
      await this.cartRepo.save(cart);
      cart.items = [];
    }

    return cart;
  }

  //* -------------------- ADD ITEM -------------------
  async addItem(userId: string, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found!!');
    }

    if (product.stock !== undefined && product.stock < dto.quantity) {
      throw new BadRequestException(
        `Only ${product.stock} units available in stock.`,
      );
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === dto.productId,
    );

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;

      if (product.stock !== undefined && newQty > product.stock) {
        throw new BadRequestException(
          `Can not add more than ${product.stock} Units.`,
        );
      }

      existingItem.quantity = newQty;
      await this.cartItemRepo.save(existingItem);
    } else {
      const newItem = this.cartItemRepo.create({
        cart,
        product,
        quantity: dto.quantity,
        snapshotPrice: product.price,
      });

      await this.cartItemRepo.save(newItem);
    }

    return this.getOrCreateCart(userId);
  }

  //* -------------------- UPDATE QUANTITY OF A SPECIFIC CART ITEM -------------------
  async updateCartItem(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((item) => item.product.id === itemId);

    if (!item) {
      throw new NotFoundException('Item not found!!');
    }

    if (item.product.stock !== undefined && dto.quantity > item.product.stock) {
      throw new BadRequestException(
        `Only ${item.product.stock} units  available.`,
      );
    }

    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);
    return await this.getOrCreateCart(userId);
  }

  //* -------------------- DELETE SINGLE ITEM FROM THE CART -------------------
  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((item) => item.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found!!');
    }

    await this.cartItemRepo.remove(item);

    return await this.getOrCreateCart(userId);
  }

  //* -------------------- CLEAR ALL ITEM FROM THE CART -------------------
  async clearCart(userId: string): Promise<{ message: string }> {
    const cart = await this.getOrCreateCart(userId);

    await this.cartItemRepo.remove(cart.items);
    return { message: 'Cart cleared' };
  }

  //* ------------------ GET CART TOTAL -----------------------------
  async getCartTotal(
    userid: string,
  ): Promise<{ totalItem: number; totalPrice: number }> {
    const cart = await this.getOrCreateCart(userid);

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + Number(item.snapshotPrice) * item.quantity,
      0,
    );

    const totalItem = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return { totalItem, totalPrice };
  }
}

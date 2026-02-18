import { Role } from "src/auth/enums/role.enum";
import { Cart } from "src/cart/entities/cart.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
   @PrimaryGeneratedColumn("uuid")
   id: string


   @Column({
      type: 'varchar',
      nullable: false,
      unique: true
   })
   email: string


   @Column({
      type: 'text',
      nullable: false,
   })
   password_hashed: string


   @Column({
      type: 'enum',
      enum: Role,
      default: Role.USER
   })
   role: Role


   @Column({
      type: 'text',
      nullable: true
   })
   hashedRefreshToken: string | null


   @CreateDateColumn()
   createdAt: Date


   @UpdateDateColumn()
   updatedAt: Date


   @OneToOne(() => Profile, profile => profile.user, {
      eager: true,
      cascade: true
   })
   @JoinColumn()
   profile: Profile


   @OneToOne(() => Cart, cart => cart.user)
   cart: Cart
}

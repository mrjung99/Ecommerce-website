import { Role } from "src/auth/enums/role.enum";
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

   @CreateDateColumn()
   createdAt: Date

   @UpdateDateColumn()
   updatedAt: Date

   @OneToOne(() => Profile, profile => profile.user, {
      eager: true,
      cascade: ['insert', 'remove']
   })
   @JoinColumn()
   profile: Profile
}

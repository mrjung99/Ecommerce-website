import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
   @PrimaryGeneratedColumn('uuid')
   id: string

   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   firstName: string


   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   lastName: string

   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   country: string

   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   state: string


   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   district: string


   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   city: string


   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   zipCode: string


   @Column({
      type: 'varchar',
      length: 100,
      nullable: true
   })
   contact: string

   @Column({
      type: 'text',
      nullable: true
   })
   profileImage: string


   @OneToOne(() => User, user => user.profile)
   user: User
}

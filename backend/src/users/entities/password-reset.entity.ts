import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class PasswordReset{
   @PrimaryGeneratedColumn('uuid')
   id!:string


   @Column()
   userId!:string
   
   @Column()
   tokenHash!:string

   @Column({type:'timestamptz'})
   expiresAt!:Date

   @Column()
   isUsed!:boolean

   @Column()
   createdAt!:Date
}
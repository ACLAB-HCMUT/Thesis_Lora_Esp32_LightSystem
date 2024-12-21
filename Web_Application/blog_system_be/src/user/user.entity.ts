import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
    type: 'datetime',
  })
  updatedAt: string;

  @Column({
    nullable: false,
    type: 'datetime',
  })
  createAt: string;

  @Column({
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    default: 'Normal',
  })
  accountType: string;

  @Column({
    default: false,
    type: 'boolean',
  })
  isActive: boolean;

  @Column({
    type: 'text',
  })
  imageURL: string;

  @Column({
    default: 'user',
  })
  role: string;

  @Column({ nullable: false })
  activateCode: string;

  @Column({ nullable: false, type: 'datetime' })
  expiredCode: string;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'blogs',
})
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'longtext',
  })
  authorID: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    nullable: false,
    default: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
    }),
  })
  createAt: string;

  @Column({
    nullable: false,
    default: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
    }),
  })
  updatedAt: string;

  @Column({
    nullable: true,
  })
  imageURL: string;

  @Column({
    nullable: false,
  })
  categoryID: string;
}

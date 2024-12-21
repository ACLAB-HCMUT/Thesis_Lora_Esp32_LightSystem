import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'devices',
})
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  device_id: string;

  @Column({
    nullable: false,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: string;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'devices',
})
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  device_id: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  status: boolean;

  @Column({
    type: 'varchar',
    default: '0',
  })
  sensor: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  check: boolean;

  @Column({
    type: 'varchar',
    default: '0',
  })
  timestamp: string;

  @Column({
    nullable: false,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: string;
}

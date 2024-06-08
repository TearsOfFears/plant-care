import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class SensorsEntity extends BaseEntity {
  @PrimaryColumn({ unique: true, type: 'timestamp' })
  time: Date;

  @Column({
    type: 'float',
    default: 0,
  })
  temperature: number;

  @Column({
    type: 'float',
    default: 0,
  })
  moisture: number;
}

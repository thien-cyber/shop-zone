import { DiscountType } from 'src/common/enums/shopzone.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'enum', enum: DiscountType })
  discountType: DiscountType = DiscountType.PERCENTAGE;

  @Column({ name: 'discount_value', type: 'numeric', precision: 12, scale: 2 })
  discountValue!: number;

  @Column({
    name: 'min_order_value',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  minOrderValue!: number;

  @Column({
    name: 'max_discount_value',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  maxDiscountValue!: number;

  @Column({ name: 'usage_limit' })
  usageLimit!: number;

  @Column({ name: 'used_count', default: 0 })
  usedCount!: number;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamptz' })
  endDate!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date;
}

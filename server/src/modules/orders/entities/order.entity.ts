import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from 'src/common/enums/shopzone.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Voucher } from '../../marketing/entities/voucher.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_number', unique: true })
  orderNumber!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User = new User();

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus = OrderStatus.PENDING_PAYMENT;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus = PaymentStatus.PENDING;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod = PaymentMethod.COD;

  @Column({ name: 'shipping_address', type: 'jsonb' })
  shippingAddress: any; // Snapshot cấu trúc địa chỉ tĩnh lúc đặt hàng

  @Column({
    name: 'shipping_fee',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  shippingFee!: number;

  @Column({
    name: 'total_items_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  totalItemsPrice!: number;

  @Column({
    name: 'discount_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  discountPrice!: number;

  @Column({ name: 'final_price', type: 'numeric', precision: 12, scale: 2 })
  finalPrice!: number;

  @Column({ name: 'voucher_id', nullable: true })
  voucherId!: string;

  @ManyToOne(() => Voucher, { onDelete: 'RESTRICT' }) // Khóa RESTRICT bảo vệ đơn hàng lịch sử
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher = new Voucher();

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductSku } from '../../catalog/entities/product-sku.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_id' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order = new Order();

  @Column({ name: 'sku_id' })
  skuId!: string;

  @ManyToOne(() => ProductSku, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sku_id' })
  productSku!: ProductSku;

  @Column()
  quantity!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price!: number; // Snapshot giá của sản phẩm tại thời điểm bấm mua hàng

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

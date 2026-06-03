import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../catalog/entities/product.entity';
import { ProductSku } from '../../catalog/entities/product-sku.entity';

@Entity('reviews')
@Unique(['userId', 'skuId']) // Chặn trùng lặp review cho cùng 1 SKU từ 1 user
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'product_id' })
  productId!: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ name: 'sku_id' })
  skuId!: string;

  @ManyToOne(() => ProductSku, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sku_id' })
  productSku!: ProductSku;

  @Column()
  rating!: number; // Thêm check constraint l-5 ở lớp DTO Validation (class-validator)

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @Column({ type: 'jsonb', nullable: true })
  images!: string[]; // Ảnh thực tế đính kèm từ khách hàng

  @Column({ name: 'is_visible', default: true })
  isVisible!: boolean; // Cho phép Admin ẩn nếu có dấu hiệu spam bẩn / từ ngữ thô tục

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

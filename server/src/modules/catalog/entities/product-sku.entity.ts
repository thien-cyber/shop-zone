/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_skus')
export class ProductSku {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.skus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ name: 'sku_code', unique: true })
  skuCode!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price!: number;

  @Column({ name: 'cost_price', type: 'numeric', precision: 12, scale: 2 })
  costPrice!: number;

  @Column({ default: 0 })
  stock!: number;

  @Column({ name: 'reserved_quantity', default: 0 })
  reservedQuantity!: number;

  @Column({ type: 'jsonb' })
  images!: string[]; // Mảng các link ảnh của SKU cụ thể

  @Column({ type: 'jsonb' })
  attributes!: Record<string, any>; // Lưu cấu trúc EAV động JSONB (VD: {"color":"Red","ram":"8GB"})

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

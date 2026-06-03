// server/src/modules/marketing/entities/flash-sale-item.entity.ts
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
import { FlashSale } from './flash-sale.entity';
import { ProductSku } from '../../catalog/entities/product-sku.entity';

@Entity('flash_sale_items')
@Unique(['flashSaleId', 'skuId'])
export class FlashSaleItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'flash_sale_id' })
  flashSaleId!: string;

  @ManyToOne(() => FlashSale, (flashSale) => flashSale.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flash_sale_id' })
  flashSale!: FlashSale;

  @Column({ name: 'sku_id' })
  skuId!: string;

  @ManyToOne(() => ProductSku, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sku_id' })
  productSku!: ProductSku;

  @Column({ name: 'flash_price', type: 'numeric', precision: 12, scale: 2 })
  flashPrice!: number;

  @Column({ name: 'sale_quantity_limit' })
  saleQuantityLimit!: number;

  @Column({ name: 'sold_count', default: 0 })
  soldCount!: number;

  @Column({ name: 'reserved_count', default: 0 })
  reservedCount!: number; // Chống Over-reservation của luồng Flash Sale

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

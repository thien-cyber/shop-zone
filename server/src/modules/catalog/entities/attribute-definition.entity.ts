/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Category } from './category.entity';
import { AttributeInputType } from '../../../common/enums/shopzone.enum';

@Entity('attribute_definitions')
@Unique(['categoryId', 'key'])
export class AttributeDefinition {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'category_id' })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.attributeDefinitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column()
  key!: string;

  @Column()
  label!: string;

  @Column({
    type: 'enum',
    enum: AttributeInputType,
    default: AttributeInputType.TEXT,
  })
  inputType!: AttributeInputType;

  @Column({ type: 'jsonb', nullable: true })
  options: any; // Lưu mảng option động của SELECT (VD: ["8GB","16GB"])

  @Column({ name: 'is_required', default: false })
  isRequired!: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder!: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string; // Sử dụng dữ liệu lớn (bigint) vì log tích tụ theo thời gian rất lớn

  @Column({ name: 'user_id', nullable: true })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User; // NULL nếu hành động do hệ thống tự kích hoạt ngầm (VD: Cron job auto-cancel)

  @Column()
  action!: string; // VD: 'UPDATE_PRODUCT_PRICE', 'BAN_USER'

  @Column()
  method!: string; // PUT, PATCH, DELETE

  @Column()
  url!: string; // Endpoint đường dẫn bị tác động

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues!: any; // Trạng thái dữ liệu trước khi đổi

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues!: any; // Trạng thái dữ liệu sau khi đổi

  @Column({ name: 'ip_address', nullable: true })
  ipAddress!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

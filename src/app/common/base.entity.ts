import {
  PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity as TypeormBaseEntity, ManyToOne
} from 'typeorm'
import { User } from '../users/user.entity'

export abstract class BaseEntity extends TypeormBaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ type: 'boolean', default: true })
    isActive: boolean

  @Column({ type: 'boolean', default: false })
    isArchived: boolean

  @CreateDateColumn({
    type: 'timestamptz',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
    // nullable: true
  })
    createdAt: Date

  @UpdateDateColumn({
    type: 'timestamptz',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
    // nullable: true
  })
    modifiedAt: Date

  @ManyToOne(() => User, (user) => user.id)
    createdBy: User

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true
  })
    modifiedBy: User
}

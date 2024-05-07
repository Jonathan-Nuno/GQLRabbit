import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Edge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  node1Alias: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  node2Alias: string;

  processed?: boolean;

  get edgePeers(): string {
    return `[${this.node1Alias}]-[${this.node2Alias}]`;
  }
}

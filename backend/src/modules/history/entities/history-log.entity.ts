import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { HistoryAction } from "../enums/history-action.enum";

@Entity()
export class HistoryLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'enum', enum: HistoryAction })
  action: HistoryAction;

  @Column()
  entity: string; // exemplo: 'User' ou 'Term'

  @Column("uuid")
  entityId: string; // pode ser string mesmo que o id seja number

  @Column({ type: 'jsonb', nullable: true })
  data: any; // estado do objeto no momento

  @CreateDateColumn()
  createdAt: Date;
}

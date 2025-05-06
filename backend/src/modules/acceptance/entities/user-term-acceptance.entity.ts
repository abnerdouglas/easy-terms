import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from "typeorm";
import { TermEntity } from "src/modules/term/entities/term.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity({ name: "user_term_acceptances" })
export class UserTermAcceptanceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  user: UserEntity;

  @ManyToOne(() => TermEntity, { nullable: false, onDelete: 'RESTRICT' })
  term: TermEntity;

  @Column({ type: 'varchar', length: 255, nullable: false })
  version: string; // Versão do termo aceito pelo usuário.

  @CreateDateColumn({ nullable: true })
  acceptedAt: Date | null; // Data em que o usuário aceitou o termo. Pode ser nula se o usuário não tiver aceitado o termo ainda.

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;
}

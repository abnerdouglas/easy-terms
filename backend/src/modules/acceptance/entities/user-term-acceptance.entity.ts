import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { TermEntity } from "src/modules/term/entities/term.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity({ name: "user_term_acceptances" })
export class UserTermAcceptanceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  user: UserEntity;
  
  @ManyToOne(() => TermEntity, { nullable: false, onDelete: 'CASCADE' })
  term: TermEntity;  

  @CreateDateColumn({ nullable: true })
  acceptedAt: Date | null; // Data em que o usuário aceitou o termo. Pode ser nula se o usuário não tiver aceitado o termo ainda.
}

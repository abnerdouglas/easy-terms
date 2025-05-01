import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { TermEntity } from "src/modules/term/entities/term.entity";

@Entity({ name: "user_term_acceptances" })
export class UserTermAcceptanceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  user: UserEntity;
  
  @ManyToOne(() => TermEntity, { nullable: false, onDelete: 'CASCADE' })
  term: TermEntity;  

  @CreateDateColumn()
  acceptedAt: Date;
}

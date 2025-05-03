import { ApiTags } from "@nestjs/swagger";
import { UserTermAcceptanceEntity } from "src/modules/acceptance/entities/user-term-acceptance.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@ApiTags("terms")
@Entity({ name: "terms" })
export class TermEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column()
  version: string;

  @Column({ name: "is_active", default: false })
  isActive: boolean;

  @OneToMany(() => UserTermAcceptanceEntity, (uta) => uta.term)
  acceptances: UserTermAcceptanceEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

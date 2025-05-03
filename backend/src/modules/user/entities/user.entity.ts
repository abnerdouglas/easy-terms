import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "../enums/role.enum";
import { UserTermAcceptanceEntity } from "src/modules/acceptance/entities/user-term-acceptance.entity";

@ApiTags("users")
@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "email", length: 70, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ name: "password", length: 255, nullable: false })
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.EMPLOYEE, nullable: false })
  role: Role;

  @OneToMany(() => UserTermAcceptanceEntity, (uta) => uta.user)
  termAcceptances?: UserTermAcceptanceEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

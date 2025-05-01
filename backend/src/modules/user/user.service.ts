import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { ListUsersDTO } from "./dto/ListUser.dto";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dataOfUser: CreateUserDTO) {
    const userEntity = new UserEntity();

    Object.assign(userEntity, dataOfUser as unknown as UserEntity);

    return this.userRepository.save(userEntity);
  }

  async listUsers() {
    const usersSaved = await this.userRepository.find();
    const usersList = usersSaved.map(
      (user) => new ListUsersDTO(user.id, user.name),
    );
    return usersList;
  }

  async findByEmail(email: string) {
    const checkEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (checkEmail === null)
      throw new NotFoundException("O email não foi encontrado.");

    return checkEmail;
  }

  async updateUser(id: string, newData: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null)
      throw new NotFoundException("O usuário não foi encontrado.");

    Object.assign(user, newData as UserEntity);

    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("O usuário não foi encontrado");
    }

    await this.userRepository.delete(user.id);

    return user;
  }
}

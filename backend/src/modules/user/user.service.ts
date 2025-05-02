import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { ListUsersDTO } from "./dto/ListUser.dto";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";
import { HistoryAction } from "../history/enums/history-action.enum";
import { HistoryService } from "../history/history.service";
import { HistoryEntity } from "../history/enums/history-entity.enum";
import { EmailService } from "../email/email.service";
import { TermEntity } from "../term/entities/term.entity";
import { ConfigService } from "@nestjs/config";
import { UserTermAcceptanceEntity } from "./entities/user-term-acceptance.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly historyService: HistoryService,
    private readonly emailService: EmailService,

    @InjectRepository(TermEntity)
    private readonly termRepository: Repository<TermEntity>,

    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,

    private readonly configService: ConfigService,
  ) {}

  async createUser(data: CreateUserDTO) {
    const userEntity = this.userRepository.create(data);
    const createdUser = await this.userRepository.save(userEntity);
    const frontendUrl = this.configService.get<string>('FRONT_URL');

    await this.historyService.log(
      HistoryAction.CREATE_USER,
      HistoryEntity.USER,
      createdUser.id,
      createdUser,
    );

    for (const termId of data.acceptedTermIds) {
      const term = await this.termRepository.findOneBy({ id: termId });
      if (!term) {
        throw new NotFoundException(`Term with id ${termId} not found`);
      }

      const acceptance = this.userTermAcceptanceRepository.create({
        user: createdUser,
        term: term,
      });

      await this.userTermAcceptanceRepository.save(acceptance);
    }    
  
    // Montar corpo do e-mail com os termos aceitos
    const acceptedTerms = await this.termRepository.findByIds(data.acceptedTermIds);
  
    const linksHtml = acceptedTerms.map(term => {
      const confirmUrl = `${frontendUrl}/confirm-consent?userId=${createdUser.id}&termId=${term.id}`;
      return `<li>${term.title}: <a href="${confirmUrl}">Confirmar aceite</a></li>`;
    }).join('');
  
    const emailHtml = `
      <p>Olá ${createdUser.name},</p>
      <p>Você assinalou os seguintes termos ao se cadastrar:</p>
      <ul>${linksHtml}</ul>
      <p>Clique nos links acima para confirmar seu consentimento individualmente.</p>
    `;
  
    await this.emailService.sendEmail(
      createdUser.email,
      "Confirmação dos termos assinalados",
      emailHtml,
    );
  
    return createdUser;
  }  

  async listUsers() {
    const usersSaved = await this.userRepository.find();
    const usersList = usersSaved.map(
      (user) => new ListUsersDTO(
        user.id, 
        user.name,
        user.email,
        user.role,
        user.createdAt,
        user.updatedAt,
      ),
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
  
  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new NotFoundException(`Usuário com email ${email} não encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar usuário por email:', error);
      throw new HttpException('Erro ao buscar usuário por email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

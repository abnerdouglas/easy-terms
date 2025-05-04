import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
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
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";

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
  ) { }

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

    // Se não houver termos aceitos, encerra aqui
    if (!data.acceptedTermIds || data.acceptedTermIds.length === 0) {
      return createdUser;
    }

    // Buscar os termos assinalados
    const acceptedTerms = await this.termRepository.findBy({
      id: In(data.acceptedTermIds),
    });

    const acceptances = acceptedTerms.map(term => {
      return this.userTermAcceptanceRepository.create({
        user: createdUser,
        term,
        acceptedAt: null,
        version: term.version,
      });
    });

    await this.userTermAcceptanceRepository.save(acceptances);

    // Construir links de confirmação
    const linksHtml = acceptedTerms.map(term => {
      const confirmUrl = `${frontendUrl}/confirm-consent?userId=${createdUser.id}&termId=${term.id}`;
      return `<li>${term.title}: <a href="${confirmUrl}">Confirmar aceite</a></li>`;
    }).join('');

    const emailHtml = `
      <p>Olá ${createdUser.name},</p>
      <p>Você assinalou os seguintes termos ao se cadastrar:</p>
      <ul>${linksHtml}</ul>
      <p>Clique nos links acima para confirmar seu consentimento individualmente.</p>
      <p>Se você não reconhece essa ação, este e-mail pode ser ignorado.</p>
      <p>Atenciosamente,</p>
      <p>Equipe Easy Terms</p>
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

    const updatedUser = await this.userRepository.save(user);

    await this.historyService.log(
      HistoryAction.UPDATE_USER,
      HistoryEntity.USER,
      id,
      updatedUser,
    );

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("O usuário não foi encontrado");
    }

    await this.userRepository.delete(user.id);

    return user;
  }

  async validateUser(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['termAcceptances', 'termAcceptances.term'],
    });
  
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
  
    // 🚫 Bloquear se houver termos com acceptedAt null
    const hasPendingTerms = (user.termAcceptances ?? []).some(
      (acceptance) => acceptance.acceptedAt === null,
    );
  
    if (hasPendingTerms) {
      throw new UnauthorizedException(
        'Você possui termos de consentimento pendentes de confirmação. Verifique seu e-mail.',
      );
    }
  
    return user;
  }
  

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['termAcceptances', 'termAcceptances.term'],
      });

      if (!user) {
        throw new NotFoundException(`Usuário com email ${email} não encontrado`);
      }
    
      // 🚫 Bloquear se houver termos com acceptedAt null
      const hasPendingTerms = (user.termAcceptances ?? []).some(
        (acceptance) => acceptance.acceptedAt === null,
      );
    
      if (hasPendingTerms) {
        throw new UnauthorizedException(
          'Você possui termos de consentimento pendentes de confirmação. Verifique seu e-mail.',
        );
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar usuário por email:', error);
      throw new HttpException('Erro ao buscar usuário por email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

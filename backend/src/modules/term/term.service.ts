import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TermEntity } from "./entities/term.entity";
import { CreateTermDTO } from "./dto/create-term.dto";
import { ListTermsDTO } from "./dto/list-term.dto";
import { UpdateTermDTO } from "./dto/update-term.dto";
import { HistoryAction } from "../history/enums/history-action.enum";
import { HistoryService } from "../history/history.service";
import { HistoryEntity } from "../history/enums/history-entity.enum";
import { ConfirmConsentDTO } from "./dto/confirm-consent.dto";
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";
import { EmailService } from "../email/email.service";
import { UserService } from "../user/user.service";

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termRepository: Repository<TermEntity>,
    private readonly historyService: HistoryService,

    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,

    private readonly userService: UserService,

    private readonly emailService: EmailService,
  ) { }

  async createTerm(data: CreateTermDTO) {
    const termEntity = new TermEntity();
    Object.assign(termEntity, data as TermEntity);

    const termCreated = await this.termRepository.save(termEntity);

    await this.historyService.log(
      HistoryAction.CREATE_TERM,
      HistoryEntity.TERM,
      termCreated.id.toString(),
      termCreated,
    );

    // Buscar todos os usuários cadastrados no sistema
    const users = await this.userService.listUsers();

    if (!users.length) {
      return termCreated;
    }

    const emailPromises = users.map(async users => {
      const user = users;

      const emailHtml = `
        <p>Olá ${user.name},</p>
        <p>Um novo termo chamado <strong>${termCreated.title} (v${termCreated.version})</strong> foi criado recentemente.</p>
        <p>O conteúdo do termo é:</p>
        <p>${termCreated.content}</p>
        <p>Esta é apenas uma notificação informativa. Não é necessário nenhuma ação de sua parte.</p>
        <p>Caso queira revogar o consentimento para este termo, acesse sua área de usuário.</p>
        <p>Atenciosamente,</p>
        <p>Equipe Easy Terms</p>
      `;

      await this.emailService.sendEmail(
        user.email,
        `Criação do termo: ${termCreated.title}`,
        emailHtml,
      );
    });

    await Promise.all(emailPromises);

    return termCreated;
  }

  async confirmConsent({ userId, termId }: ConfirmConsentDTO) {
    const existing = await this.userTermAcceptanceRepository.findOne({
      where: {
        user: { id: userId },
        term: { id: termId },
      },
      relations: ['user', 'term'],
    });

    if (!existing) {
      throw new NotFoundException('Aceite inicial do termo não encontrado.');
    }

    existing.acceptedAt = new Date();
    return this.userTermAcceptanceRepository.save(existing);
  }

  async listTerms() {
    const termsSaved = await this.termRepository.find();
    const termsList = termsSaved.map(
      (term) => new ListTermsDTO(
        term.id.toString(),
        term.title,
        term.content,
        term.version,
        term.createdAt,
        term.updatedAt,
        term.isActive)
    );
    return termsList;
  }

  async updateTerm(id: string, newData: UpdateTermDTO) {
    const term = await this.termRepository.findOneBy({ id });

    if (!term) {
      throw new NotFoundException("O termo não foi encontrado.");
    }

    Object.assign(term, newData as TermEntity);
    const updatedTerm = await this.termRepository.save(term);

    await this.historyService.log(
      HistoryAction.UPDATE_TERM,
      HistoryEntity.TERM,
      id,
      term,
    );

    // Buscar todos os usuários que aceitaram esse termo
    const acceptances = await this.userTermAcceptanceRepository.find({
      where: { term: { id } },
      relations: ['user'],
    });

    if (!acceptances.length) {
      return updatedTerm;
    }

    const emailPromises = acceptances.map(async acceptance => {
      const user = acceptance.user;

      const emailHtml = `
        <p>Olá ${user.name},</p>
        <p>O termo <strong>${term.title} (v${term.version})</strong> foi atualizado recentemente.</p>
        <p>O novo conteúdo do termo é:</p>
        <p>${term.content}</p>
        <p>Esta é apenas uma notificação informativa. Não é necessário nenhuma ação de sua parte.</p>
        <p>Caso queira revogar o consentimento para este termo, acesse sua área de usuário.</p>
        <p>Atenciosamente,</p>
        <p>Equipe Easy Terms</p>
      `;

      await this.emailService.sendEmail(
        user.email,
        `Atualização do termo: ${term.title}`,
        emailHtml,
      );
    });

    await Promise.all(emailPromises);

    return updatedTerm;
  }

  async deleteTerm(id: string) {
    const term = await this.termRepository.findOneBy({ id });

    if (!term) {
      throw new NotFoundException("O termo não foi encontrado");
    }

    await this.termRepository.delete(term.id);

    // Buscar todos os usuários cadastrados no sistema
    const users = await this.userService.listUsers();

    if (!users.length) {
      return term;
    }

    const emailPromises = users.map(async users => {
      const user = users;

      const emailHtml = `
        <p>Olá ${user.name},</p>
        <p>O <strong>${term.title} (v${term.version})</strong> foi excluído de nosso sistema recentemente.</p>
        <p>O conteúdo do termo é:</p>
        <p>${term.content}</p>
        <p>Esta é apenas uma notificação informativa. Não é necessário nenhuma ação de sua parte.</p>
        <p>Caso queira revogar o consentimento para outros termos cadastrados em nosso sistema, acesse sua área de usuário.</p>
        <p>Atenciosamente,</p>
        <p>Equipe Easy Terms</p>
      `;

      await this.emailService.sendEmail(
        user.email,
        `Exclusão do termo: ${term.title}`,
        emailHtml,
      );
    });

    await Promise.all(emailPromises);

    return term;
  }
}

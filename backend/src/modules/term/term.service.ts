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
import { UserTermAcceptanceEntity } from "../user/entities/user-term-acceptance.entity";

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termRepository: Repository<TermEntity>,
    private readonly historyService: HistoryService,

    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,
  ) {}

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

    return termCreated;
  }

  async confirmConsent({ userId, termId }: ConfirmConsentDTO) {
    const existing = await this.userTermAcceptanceRepository.findOne({
      where: {
        user: { id: userId },
        term: { id: termId },
      },
      relations: ['user', 'term'], // necessário para buscar por campos aninhados
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

    if (term === null)
      throw new NotFoundException("O termo não foi encontrado.");

    Object.assign(term, newData as TermEntity);

    return this.termRepository.save(term);
  }

  async deleteTerm(id: string) {
    const term = await this.termRepository.findOneBy({ id });

    if (!term) {
      throw new NotFoundException("O termo não foi encontrado");
    }

    await this.termRepository.delete(term.id);

    return term;
  }
}

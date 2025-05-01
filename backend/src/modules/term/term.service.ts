import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TermEntity } from "./term.entity";
import { CreateTermDTO } from "./dto/create-term.dto";
import { ListTermsDTO } from "./dto/list-term.dto";
import { UpdateTermDTO } from "./dto/update-term.dto";

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termRepository: Repository<TermEntity>,
  ) {}

  async createTerm(data: CreateTermDTO) {
    const termEntity = new TermEntity();

    Object.assign(termEntity, data as TermEntity);

    return this.termRepository.save(termEntity);
  }

  async listTerms() {
    const termsSaved = await this.termRepository.find();
    const termsList = termsSaved.map(
      (term) => new ListTermsDTO(term.id.toString(), term.title, term.content),
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

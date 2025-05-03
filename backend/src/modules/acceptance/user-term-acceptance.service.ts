import { ListAcceptancesDTO } from './dto/list-acceptance.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserTermAcceptanceEntity } from './entities/user-term-acceptance.entity';
import { TermEntity } from '../term/entities/term.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class UserTermAcceptanceService {
  constructor(
    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,
  ) { }

  async findAll(filter?: { userId?: string; termId?: string }): Promise<ListAcceptancesDTO[]> {
    const where: FindOptionsWhere<UserTermAcceptanceEntity> = {};

    if (filter?.userId) {
      where.user = { id: filter.userId } as UserEntity;
    }

    if (filter?.termId) {
      where.term = { id: filter.termId } as TermEntity;
    }

    const acceptances = await this.userTermAcceptanceRepository.find({
      where,
      relations: ['user', 'term'],
      order: { acceptedAt: 'DESC' },
    });

    return acceptances.map(
      (item) =>
        new ListAcceptancesDTO(
          item.id,
          item.acceptedAt,
          item.revokedAt,
          item.version,
          item.user,
          item.term,
        ),
    );
  }

  async revokeConsent(id: string): Promise<UserTermAcceptanceEntity | null> {
    const record = await this.userTermAcceptanceRepository.findOne({ where: { id }, relations: ['user', 'term'] });

    if (!record) return null;

    record.revokedAt = new Date(); // Define a data de revogação como a data atual
    return this.userTermAcceptanceRepository.save(record);
  }

}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { HistoryLogEntity } from './entities/history-log.entity';
import { HistoryAction } from './enums/history-action.enum';
import { HistoryEntity } from './enums/history-entity.enum';
import { ListHistoryLogDTO } from './dto/list-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryLogEntity)
    private readonly historyRepository: Repository<HistoryLogEntity>,
  ) {}

  async log(action: HistoryAction, entity: HistoryEntity, entityId: string, data?: any) {
    const history = this.historyRepository.create({
      action,
      entity,
      entityId,
      data,
    });
    return this.historyRepository.save(history);
  }

  async findAll(filters?: ListHistoryLogDTO) {
    const where: FindOptionsWhere<HistoryLogEntity> = {};
    
    if (filters?.entity) where.entity = filters.entity;
    if (filters?.entityId) where.entityId = filters.entityId;
  
    return this.historyRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
  
}

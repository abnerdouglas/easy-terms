import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryLogEntity } from './entities/history-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryLogEntity])],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})

export class HistoryModule {}

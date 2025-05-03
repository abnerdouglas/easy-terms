import { Module } from '@nestjs/common';
import { UserTermAcceptanceService } from './user-term-acceptance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTermAcceptanceEntity } from './entities/user-term-acceptance.entity';
import { UserTermAcceptanceController } from './user-term-acceptance.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserTermAcceptanceEntity])],
    controllers: [UserTermAcceptanceController],
    exports: [UserTermAcceptanceService],
    providers: [UserTermAcceptanceService],
})

export class UserTermAcceptanceModule { }
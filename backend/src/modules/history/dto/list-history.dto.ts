import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { HistoryEntity } from "../enums/history-entity.enum";

export class ListHistoryLogDTO {
    @IsEnum(HistoryEntity, { message: "entity deve ser um valor válido" })
    @IsOptional()
    entity?: HistoryEntity;

    @IsUUID("all", { message: "entityId deve ser um UUID" })
    @IsOptional()
    entityId?: string;
}

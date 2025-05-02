import { IsUUID } from 'class-validator';

export class ConfirmConsentDTO {
  @IsUUID()
  userId: string;

  @IsUUID()
  termId: string;
}

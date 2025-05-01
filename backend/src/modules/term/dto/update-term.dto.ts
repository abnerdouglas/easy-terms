import { PartialType } from "@nestjs/swagger";
import { CreateTermDTO } from "./create-term.dto";

export class UpdateTermDTO  extends PartialType(CreateTermDTO) {}
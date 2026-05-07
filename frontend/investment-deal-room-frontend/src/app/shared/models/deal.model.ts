import { Currency } from '../enums/currency.enum';
import { DealType } from '../enums/deal-type.enum';
import { PipelineStage } from '../enums/pipeline-stage.enum';

export interface Deal {
  id?: string;
  dealName: string;
  dealType: DealType;
  targetCompany: string;
  estimatedValue: number;
  currency: Currency;
  assignedManagerId?: string;
  pipelineStage: PipelineStage;
}

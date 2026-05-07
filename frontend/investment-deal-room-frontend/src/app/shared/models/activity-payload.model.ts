import { DealRole } from '../enums/deal-role.enum';
import { PipelineStage } from '../enums/pipeline-stage.enum';

export interface ActivityPayload {
  fromStage?: PipelineStage;
  toStage?: PipelineStage;
  counterpartyId?: string;
  counterpartyName?: string;
  counterpartyRole?: DealRole;
}

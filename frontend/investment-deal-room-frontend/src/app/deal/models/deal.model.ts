import { Currency } from "./currency.enum";
import { DealType } from "./deal-type.enum";
import { PipelineStage } from "./pipeline-stage.enum";

export interface Deal {
  id: string;
  name: string;
  type: DealType;
  targetCompany: string;
  estimatedValue: number;
  currency: Currency;
  pipelineStage: PipelineStage;
}
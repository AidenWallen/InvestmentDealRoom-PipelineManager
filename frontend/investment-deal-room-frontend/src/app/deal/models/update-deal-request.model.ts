import { Currency } from "./currency.enum";
import { DealType } from "./deal-type.enum";

export interface UpdateDealRequest {
  dealName: string;
  dealType: DealType;
  targetCompany: string;
  estimatedValue: number;
  currency: Currency;
}
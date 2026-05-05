import { Currency } from "../enums/currency.enum";
import { DealType } from "../enums/deal-type.enum";

export interface UpdateDealRequest {
  dealName: string;
  dealType: DealType;
  targetCompany: string;
  estimatedValue: number;
  currency: Currency;
}
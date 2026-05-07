import { DealRole } from '../enums/deal-role.enum';

export interface DealCounterpartyLink {
  dealId:          string;
  counterpartyId:  string;
  dealRole:        DealRole;
}

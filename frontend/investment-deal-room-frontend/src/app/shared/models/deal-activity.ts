import { ActivityType } from "../enums/activity-type.enum";
import { ActivityPayload } from "./activity-payload.model";

export interface DealActivity {
  id:              string;
  dealId:          string;
  activityType:    ActivityType;
  performedBy:     string;
  performedByName: string;
  occurredAt:      string;   
  payload:         ActivityPayload;
}
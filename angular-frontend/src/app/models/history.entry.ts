export interface HistoryEntry {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  userId: number;
  timestamp: Date;
  changes: Record<string, { oldValue: any; newValue: any }>;
}
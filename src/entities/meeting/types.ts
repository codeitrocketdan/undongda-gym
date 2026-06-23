export interface Dagym {
  id: number;
  name: string;
  type: string;
  region: string;
  address: string | null;
  dateTime: string;
  isCompleted: boolean;
  confirmedAt: string | null;
}

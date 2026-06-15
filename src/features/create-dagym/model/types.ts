export interface DagymFormData {
  type: string;
  name: string;
  region: string;
  address: string;
  addressDetail: string;
  latitude: number | null;
  longitude: number | null;
  image: File | null;
  description: string;
  dateTime: Date;
  registrationEnd: Date;
  capacity: number;
}

export interface Resident {
  id: number;
  name: string;
  roomNumber: string;
  dateOfBirth?: string;
  fileRefs: string[];
}

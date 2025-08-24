export interface Resident {
  id: number; // internal ID
  name: string;
  dateOfBirth?: string; // optional: 'YYYY-MM-DD'
  roomNumber?: string;
  fileRefs?: string[] | string; // list of file URLs or names
  created_at?: string;
  updated_at?: string;
}

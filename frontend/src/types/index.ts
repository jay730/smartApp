// TypeScript interfaces for our data models

export interface Resident {
  id: number;
  name: string;
  roomNumber: string;
  dateOfBirth?: string;
  fileRefs: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id: number;
  name: string;
  role: 'caregiver' | 'nurse' | 'admin';
  assignedResidents: number[];
  fileRefs: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: number; // Staff ID
  assignedResident?: number; // Resident ID (optional)
  dueDate?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Form data types
export interface ResidentFormData {
  name: string;
  roomNumber: string;
  dateOfBirth?: string;
  files?: File[];
}

export interface StaffFormData {
  name: string;
  role: 'caregiver' | 'nurse' | 'admin';
  assignedResidents: number[];
  files?: File[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: number;
  assignedResident?: number;
  dueDate?: string;
}

// Staff Service - Handles all API calls to the backend for staff management
// This is a simple service that uses axios to communicate with our backend

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Staff, ApiResponse } from '../types/index.js';

// Base URL for our API - change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000';

class StaffService {
  private api: AxiosInstance;

  constructor() {
    // Create an axios instance with default configuration
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 second timeout
    });
  }

  // Get all staff from the backend
  async getAllStaff(): Promise<Staff[]> {
    try {
      console.log('Fetching all staff...');
      const response: AxiosResponse<Staff[]> = await this.api.get('/staff');
      console.log('Staff fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw new Error('Failed to fetch staff. Please try again.');
    }
  }

  // Create a new staff member with file upload
  async createStaff(formData: FormData): Promise<Staff> {
    try {
      console.log('Creating new staff member...');
      const response: AxiosResponse<Staff> = await this.api.post('/staff', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      console.log('Staff member created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw new Error('Failed to create staff member. Please check your input and try again.');
    }
  }

  // Get a single staff member by ID
  async getStaffById(id: number): Promise<Staff> {
    try {
      console.log(`Fetching staff member with ID: ${id}`);
      const response: AxiosResponse<Staff> = await this.api.get(`/staff/${id}`);
      console.log('Staff member fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw new Error('Failed to fetch staff member. Please try again.');
    }
  }

  // Update a staff member
  async updateStaff(id: number, formData: FormData): Promise<Staff> {
    try {
      console.log(`Updating staff member with ID: ${id}`);
      const response: AxiosResponse<Staff> = await this.api.put(`/staff/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Staff member updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw new Error('Failed to update staff member. Please try again.');
    }
  }

  // Delete a staff member
  async deleteStaff(id: number): Promise<boolean> {
    try {
      console.log(`Deleting staff member with ID: ${id}`);
      await this.api.delete(`/staff/${id}`);
      console.log('Staff member deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw new Error('Failed to delete staff member. Please try again.');
    }
  }
}

// Create and export a single instance of the service
// This is called a "singleton" pattern - we only want one instance of this service
const staffService = new StaffService();

// Export the service so other components can use it
export default staffService;

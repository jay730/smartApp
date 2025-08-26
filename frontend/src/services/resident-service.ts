// Resident Service - Handles all API calls to the backend
// This is a simple service that uses axios to communicate with our backend

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Resident, ApiResponse } from '../types/index.js';

// Base URL for our API - change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000';

class ResidentService {
  private api: AxiosInstance;

  constructor() {
    // Create an axios instance with default configuration
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 second timeout
    });
  }

  // Get all residents from the backend
  async getAllResidents(): Promise<Resident[]> {
    try {
      console.log('Fetching all residents...');
      const response: AxiosResponse<Resident[]> = await this.api.get('/residents');
      console.log('Residents fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching residents:', error);
      throw new Error('Failed to fetch residents. Please try again.');
    }
  }

  // Create a new resident with file upload
  async createResident(formData: FormData): Promise<Resident> {
    try {
      console.log('Creating new resident...');
      const response: AxiosResponse<Resident> = await this.api.post('/residents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      console.log('Resident created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating resident:', error);
      throw new Error('Failed to create resident. Please check your input and try again.');
    }
  }

  // Get a single resident by ID
  async getResidentById(id: number): Promise<Resident> {
    try {
      console.log(`Fetching resident with ID: ${id}`);
      const response: AxiosResponse<Resident> = await this.api.get(`/residents/${id}`);
      console.log('Resident fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching resident:', error);
      throw new Error('Failed to fetch resident. Please try again.');
    }
  }

  // Update a resident
  async updateResident(id: number, formData: FormData): Promise<Resident> {
    try {
      console.log(`Updating resident with ID: ${id}`);
      const response: AxiosResponse<Resident> = await this.api.put(`/residents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Resident updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating resident:', error);
      throw new Error('Failed to update resident. Please try again.');
    }
  }

  // Delete a resident
  async deleteResident(id: number): Promise<boolean> {
    try {
      console.log(`Deleting resident with ID: ${id}`);
      await this.api.delete(`/residents/${id}`);
      console.log('Resident deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting resident:', error);
      throw new Error('Failed to delete resident. Please try again.');
    }
  }
}

// Create and export a single instance of the service
// This is called a "singleton" pattern - we only want one instance of this service
const residentService = new ResidentService();

// Export the service so other components can use it
export default residentService;

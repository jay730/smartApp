// services/residentService.ts
import axios from "axios";

const API = "http://localhost:5000";

export const createResident = (formData: FormData) =>
  axios.post(`${API}/residents/`, formData);

export const getAllResidents = () => axios.get(`${API}/residents`);

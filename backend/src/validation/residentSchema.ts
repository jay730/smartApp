import { z } from "zod";

export const createResidentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  roomNumber: z.string().optional()
});

export type CreateResidentInput = z.infer<typeof createResidentSchema>;
import { z } from 'zod';

export const borrowValidationSchema = z.object({
  book: z.string({ required_error: 'Book ID is required' }),
  quantity: z.number({ required_error: 'Quantity is required' }).min(1, 'Quantity must be at least 1'),
  dueDate: z.string({ required_error: 'Due date is required' }).refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});
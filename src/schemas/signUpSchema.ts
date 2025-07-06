import {z} from 'zod';

export const usernameValidation = z
.string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(20, { message: 'Username must be at most 20 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dateOfBirth: z.date({
    message: 'Date of birth is required',
    required_error: 'Date of birth is required',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  provider: z.string(),
  link: z.string()
});
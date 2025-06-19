import {z} from 'zod';

export const postSchema = z.object({
  post: z.string().min(1, {message: "Post is required"}),
  category: z.string().min(1, {message: "Category is required"}),
  photo: z.string().optional(),
  video: z.string().optional(),
  link: z.string().optional(),
  tags: z.array(z.string()).optional(),
  event: z.string().optional(),
});
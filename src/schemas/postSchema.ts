import {z} from 'zod';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_MEDIA_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/ogg", "video/quicktime"];


export const postSchema = z.object({
  post: z.string().min(1, {message: "Post is required"}),
  category: z.string().min(1, {message: "Category is required"}),
  media: z.any()
    .optional()
    .refine((file) => {
        if (!file) return true; // Allow empty
        return file.size <= MAX_FILE_SIZE;
    }, `Max file size is 50MB.`)
    .refine((file) => {
        if (!file) return true;
        return ACCEPTED_MEDIA_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png, .gif, .webp, .mp4, .webm, .ogg, and .mov formats are supported."),
  link: z.string().optional(),
  tags: z.array(z.string()).optional(),
  event: z.string().optional(),
  userId: z.string().optional(),
});
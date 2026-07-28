import { z } from 'zod';

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 6;
export const BIO_MAX = 500;
export const TITLE_MAX = 100;
export const CONTENT_MAX = 2000;
export const CATEGORY_MIN = 1;
export const CATEGORY_MAX = 50;
export const REPORT_REASON_MIN = 5;
export const REPORT_REASON_MAX = 200;
export const SEARCH_QUERY_MIN = 2;
export const SEARCH_QUERY_MAX = 100;

export const emailSchema = z.string().trim().email();
export const passwordSchema = z.string().min(PASSWORD_MIN);
export const usernameSchema = z.string()
  .trim()
  .min(USERNAME_MIN)
  .max(USERNAME_MAX)
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Username must start with a letter and contain only letters, numbers, and underscores');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  bio: z.string().trim().max(BIO_MAX).optional(),
  avatarUrl: z.string().trim().max(2000).url().optional().or(z.literal('')),
});

export const createNoteSchema = z.object({
  title: z.string().trim().max(TITLE_MAX).optional().nullable(),
  content: z.string().trim().min(1).max(CONTENT_MAX),
  category: z.string().trim().min(CATEGORY_MIN).max(CATEGORY_MAX),
});

export const updateNoteSchema = createNoteSchema;
export const flagSchema = z.object({
  reason: z.string().trim().min(REPORT_REASON_MIN).max(REPORT_REASON_MAX),
});

export const profileTabSchema = z.enum(['notes', 'likes', 'followers', 'following', 'flags']);
export const querySchema = z.string().trim().min(SEARCH_QUERY_MIN).max(SEARCH_QUERY_MAX);
export const uuidSchema = z.string().uuid();

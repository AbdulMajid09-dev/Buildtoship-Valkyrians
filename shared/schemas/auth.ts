import { z } from 'zod';

export const RegisterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(150, { message: 'Full name must not exceed 150 characters' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email must not exceed 255 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password must not exceed 128 characters' }),
  preferredLanguage: z
    .string()
    .trim()
    .max(50, { message: 'Language must not exceed 50 characters' })
    .optional()
    .default('English'),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export const ProfileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(150, { message: 'Full name must not exceed 150 characters' })
    .optional(),
  preferredLanguage: z
    .string()
    .trim()
    .max(50, { message: 'Language must not exceed 50 characters' })
    .optional(),
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required to change password' })
    .optional(),
  newPassword: z
    .string()
    .min(8, { message: 'New password must be at least 8 characters' })
    .max(128, { message: 'New password must not exceed 128 characters' })
    .optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to set a new password',
  path: ['currentPassword'],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

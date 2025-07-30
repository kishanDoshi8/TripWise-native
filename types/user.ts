import { z } from 'zod';

export const emailSchema = z.email("Invalid email address");

export const userSchema = z.object({
    id: z.uuid(),
    displayName: z.string().trim().min(3).max(18),
    tag: z.string().trim().length(4),
    email: emailSchema,
    lastTripId: z.string().nullish(),
});

export type User = z.infer<typeof userSchema>;
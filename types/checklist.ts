import { z } from 'zod';

export const ChecklistBaseSchema = z.object({
    tripId: z.string().min(1),
    name: z.string().min(1),
    order: z.number().min(0).default(0),
    createdAt: z.coerce.date(),
});
export type ChecklistBase = z.infer<typeof ChecklistBaseSchema>;

export const ChecklistSchema = ChecklistBaseSchema.extend({
    id: z.string().min(1),
});
export type Checklist = z.infer<typeof ChecklistSchema>;

export const ChecklistCreateSchema = ChecklistBaseSchema.omit({
    createdAt: true
});
export type ChecklistCreate = z.infer<typeof ChecklistCreateSchema>;
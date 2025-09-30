import { z } from 'zod';

export const memberUserSchema = z.object({
    id: z.string(),
    displayName: z.string().min(3).max(18),
    tag: z.string().length(4),
    email: z.email(),
});
export type MemberUser = z.infer<typeof memberUserSchema>;


export type Role = 'Organizer' | 'Member';
export type Status = 'Accepted' | 'Declined' | 'Invited';

const roleSchema = z.enum(["Organizer", "Member"]);
const statusSchema = z.enum(["Accepted", "Declined", "Invited"]);

export const memberSchema = z.object({
    status: statusSchema,
    role: roleSchema,
    user: memberUserSchema,
});

export type Member = z.infer<typeof memberSchema>;
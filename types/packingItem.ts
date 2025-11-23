import { z } from "zod";
import { memberUserSchema } from "./member";

export const ItemSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullish(),
    category: z.string().nullish(),
    isPersonal: z.boolean().default(false),
    quantity: z.number().min(1).default(1),
    tripId: z.string().min(1),
    packedStatus: z.boolean(),
    addedBy: memberUserSchema,
    createdAt: z.coerce.date(),
    assignees: z.array(memberUserSchema).nullish(),
});
export type Item = z.infer<typeof ItemSchema>;
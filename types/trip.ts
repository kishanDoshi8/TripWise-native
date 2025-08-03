import { z } from 'zod';
import { memberSchema, memberUserSchema } from './member';
import { thumbnailSchema } from './thumbnail';

export const TripBaseSchema = z.object({
    id: z.uuid(),
    name: z.string().trim().min(1),
    description: z.string().nullish(),
    locationName: z.string().trim().min(1),
    locationLink: z.url().or(z.literal("")).nullish(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    placeId: z.string().trim().nullish(),
    thumbnail: thumbnailSchema.nullish(),
});

export type TripBase = z.infer<typeof TripBaseSchema>;

export const TripUpdateSchema = TripBaseSchema
    .extend({
        id: z.string().trim().min(1),
    });

export type TripUpdate = z.infer<typeof TripUpdateSchema>;

export const TripSchema = TripBaseSchema
    .extend({
        createdBy: memberUserSchema,
        members: z.array(memberSchema).nullish(),
        templateIds: z.number().array().nullish(),
    });

export type Trip = z.infer<typeof TripSchema>;
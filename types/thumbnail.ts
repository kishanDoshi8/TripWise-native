import { z } from 'zod';

export type ThumbnailSource = 'google' | 'url' | 'image';

export const thumbnailSchema = z.object({
    source: z.enum(['google', 'url', 'image']),
    photoReference: z.string().nullish(),
    url: z.string().nullish(),
    image: z.string().nullish(),
});

export type Thumbnail = z.infer<typeof thumbnailSchema>;
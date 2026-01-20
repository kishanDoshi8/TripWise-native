import { z } from "zod";

export const ImageSchema = z.object({
	id: z.string(),
	slug: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	width: z.number(),
	height: z.number(),
	color: z.string().nullable(),
	blur_hash: z.string().nullable(),
	description: z.string().nullable(),
	alt_description: z.string().nullable(),
	urls: z.object({
		raw: z.string(),
		full: z.string(),
		regular: z.string(),
		small: z.string(),
		thumb: z.string(),
	}),
	links: z.object({
		self: z.string(),
		html: z.string(),
		download: z.string(),
		download_location: z.string(),
	}),
	user: z.object({
		id: z.string(),
		username: z.string(),
		name: z.string(),
		portfolio_url: z.string().nullable(),
	}),
});

export type Image = z.infer<typeof ImageSchema>;

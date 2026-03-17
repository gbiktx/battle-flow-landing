import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		author: z.string(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		reading_time: z.number().optional(),
	}),
});

export const collections = { blog };

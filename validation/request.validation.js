import { z } from 'zod';

export const signupPostRequestSchema = z.object({
    firstname: z.string(),
    lastname: z.string().optional(),
    email: z.email(),
    password: z.string().min(3),
});

export const loginPostRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(3),
});

export const shortenPostRequestBodySchema = z.object({
    url: z.url(),
    code: z.string().optional(),
});
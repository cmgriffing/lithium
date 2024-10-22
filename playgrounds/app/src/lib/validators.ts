import { z } from 'zod'

export const snippetValidator = z.object({
  title: z.string().min(1).max(100),
  codeLeft: z
    .string()
    .min(1)
    .max(5 * 1024),
  codeRight: z
    .string()
    .min(1)
    .max(5 * 1024),
})

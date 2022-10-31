import { createRouter } from './context'
import { z } from 'zod'

export const pollRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string(),
      movies: z.number().int().array().min(2),
    }),
    resolve: async ({ ctx, input }) => {
      const poll = await ctx.prisma.poll.create({
        data: {
          question: input.question,
          movies: {
            create: input.movies.map(movieId => ({
              id: movieId
            }))
          }
        },
      })
      return poll.id
    },
  })

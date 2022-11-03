import { createRouter } from './context'
import { z } from 'zod'

export const pollRouter = createRouter()
  .query('get', {
    input: z.string(),
    resolve: async ({ ctx, input: id }) => {
      const poll = await ctx.prisma.poll.findUnique({
        where: { id },
        include: {
          movies: {
            select: {
              id: true,
              _count: {
                select: {
                  votes: true
                }
              }
            }
          },
        },
      })
      if (!poll) return poll
      return {
        ...poll,
        movies: poll.movies.map(movie => ({
          id: movie.id,
          votes: movie._count.votes
        }))
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
            create: input.movies.map((movieId) => ({
              id: movieId,
            })),
          },
        },
      })
      return poll.id
    },
  })
  .mutation('vote', {
    input: z.object({
      pollId: z.string(),
      movieId: z.number(),
    }),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.vote.create({
        data: {
          movieId: input.movieId,
          moviePollId: input.pollId,
        }
      })
    }
  })

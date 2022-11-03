import z from 'zod'
import { useQuery } from 'react-query'
import { env } from './env/client.mjs'

const BASE_URL = 'https://api.themoviedb.org/3/'

type Params = {
  [key: string]: string
}

const fetchTmdb = async (path: string, params?: Params) => {
  const url = new URL(path, BASE_URL)
  url.searchParams.set('api_key', env.NEXT_PUBLIC_TMDB_API_KEY)
  if (params) {
    Object.entries(params).forEach(([key, param]) =>
      url.searchParams.set(key, param)
    )
  }
  return fetch(url).then((res) => res.json())
}

const movieValidator = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
})
export type Movie = z.infer<typeof movieValidator>

export const useSearch = (query: string) => {
  return useQuery(
    ['search', query],
    async () => {
      const response = await fetchTmdb('search/movie', { query })
      const validator = z.object({
        results: movieValidator.array(),
      })
      return validator.parse(response).results
    },
    {
      enabled: !!query,
      keepPreviousData: true,
    }
  )
}

export const useMovie = (id: number) => {
  return useQuery(
    ['getMovie', id],
    async () => {
      const response = await fetchTmdb(`movie/${id}`)
      return movieValidator.parse(response)
    }
  )
}

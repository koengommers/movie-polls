import { RadioGroup } from '@headlessui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { cva } from 'class-variance-authority'
import { trpc } from '../../utils/trpc'
import { useMovie } from '../../tmdb'
import TmdbImage from '../../components/TmdbImage'
import Button from '../../components/Button'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

const movieOptionStyles = cva(
  'cursor-pointer rounded-lg flex items-center p-2',
  {
    variants: {
      checked: { true: ['bg-blue-700'], false: ['bg-zinc-800'] },
    },
  }
)

const MovieOption = ({ id, checked }: { id: number; checked: boolean }) => {
  const { data: movie } = useMovie(id)
  return (
    <div className={movieOptionStyles({ checked })}>
      {movie?.poster_path ? (
        <TmdbImage
          path={movie.poster_path}
          width="46"
          height="69"
          layout="intrinsic"
          type="poster"
          className="rounded"
          alt={movie.title}
        />
      ) : (
        <div className="h-[69px] w-[46px] bg-zinc-700"></div>
      )}
      <span className="ml-4">{movie?.title}</span>
    </div>
  )
}

const Result = ({ movie }: { movie: { id: number; votes: number } }) => {
  const { data } = useMovie(movie.id)
  if (!data) return null
  return (
    <div>
      {data.title}: {movie.votes}
    </div>
  )
}

const Poll = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const { data } = trpc.useQuery(['poll.get', id])
  const [hasVoted, setHasVoted] = useState(false)
  const mutation = trpc.useMutation(['poll.vote'], {
    onSuccess: (_, { pollId, movieId }) => {
      setHasVoted(true)
      if (data) {
        queryClient.setQueryData(['poll.get', pollId], {
          ...data,
          movies: data.movies.map((movie) =>
            movie.id === movieId
              ? {
                  ...movie,
                  votes: movie.votes + 1,
                }
              : movie
          ),
        })
      }
    },
  })
  const [selectedMovie, setSelectedMovie] = useState<number | undefined>(
    undefined
  )

  const submitVote = () => {
    if (!selectedMovie) return
    mutation.mutate({
      pollId: id,
      movieId: selectedMovie,
    })
  }

  if (!data) return null

  return (
    <>
      <Head>
        <title>Movie Polls</title>
        <meta name="description" content="Vote for a movie poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center">
        <h1 className="my-16 text-6xl font-medium">{data?.question}</h1>
        {!hasVoted ? (
          <>
            <RadioGroup value={selectedMovie} onChange={setSelectedMovie}>
              <RadioGroup.Label>Movies</RadioGroup.Label>
              {data.movies.map((movie) => (
                <RadioGroup.Option key={movie.id} value={movie.id}>
                  {({ checked }) => (
                    <MovieOption id={movie.id} checked={checked} />
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
            <Button onClick={submitVote}>Vote</Button>
          </>
        ) : (
          data.movies.map((movie) => <Result key={movie.id} movie={movie} />)
        )}
      </div>
    </>
  )
}

const PollPage = () => {
  const router = useRouter()
  const { id } = router.query

  if (!id || typeof id !== 'string') return null

  return <Poll id={id} />
}

export default PollPage

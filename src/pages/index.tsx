import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Button from '../components/Button'
import MoviePicker from '../components/MoviePicker'
import TmdbImage from '../components/TmdbImage'
import { Movie } from '../tmdb'
/* import { trpc } from "../utils/trpc"; */

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  /* const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]); */
  return (
    <>
      <Head>
        <title>Movie Voting</title>
        <meta name="description" content="Make a movie poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MoviePicker
        addMovie={(movie) => setMovies((movies) => [...movies, movie])}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />

      <div className="flex flex-col items-center">
        <h1 className="text-6xl my-16 font-medium">Create a movie poll</h1>
        <input
          className="w-full max-w-3xl rounded-lg bg-zinc-800 p-2 text-2xl placeholder:italic placeholder:text-zinc-500 focus-visible:outline focus-visible:outline-blue-700"
          type="text"
          placeholder="e.g.: What movie are we going to watch?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="m-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-8">
        {movies.map((movie) => movie.poster_path ? (
          <TmdbImage
            alt={movie.title}
            type="poster"
            path={movie.poster_path}
            width="185"
            height="278"
            layout="intrinsic"
            className="rounded-lg bg-zinc-800"
          />
        ) : (
          <div className="w-[185px] h-[278px] rounded-lg bg-zinc-800" />
        ))}
        <button
          className="h-[278px] w-[185px] rounded-lg border border-zinc-600 bg-zinc-800 hover:bg-zinc-700"
          onClick={() => setIsOpen(true)}
        >
          Add movie
        </button>
      </div>
      <div className="mt-16 flex flex-col items-center">
        <Button disabled={true}>Start poll</Button>
      </div>
    </>
  )
}

export default Home

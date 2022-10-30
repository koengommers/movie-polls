import { useState } from 'react'
import { Combobox, Dialog } from '@headlessui/react'
import { Movie, useSearch } from '../tmdb'
import TmdbImage from './TmdbImage'

const MoviePicker = ({
  isOpen,
  close,
  addMovie,
}: {
  isOpen: boolean
  close: () => void
  addMovie: (movie: Movie) => void
}) => {
  const [query, setQuery] = useState('')
  const { data = [] } = useSearch(query)

  const selectMovie = (movie: Movie) => {
    addMovie(movie)
    close()
  }

  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 p-4 pt-16">
        <Dialog.Panel className="rounded-xl px-4 m-auto max-w-2xl bg-zinc-800">
          <Combobox onChange={selectMovie}>
            <Combobox.Input
              className="w-full my-4 max-w-3xl rounded-lg bg-zinc-700 p-2 text-2xl placeholder:italic placeholder:text-zinc-500 focus-visible:outline focus-visible:outline-blue-700"
              placeholder="Search for a movie..."
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Options className="max-h-[600px] overflow-y-scroll mb-4">
              {data.map((movie) => (
                <Combobox.Option
                  className="last:mb-4 cursor-pointer ui-active:bg-blue-600 rounded-lg flex items-center p-2 my-1"
                  key={movie.id}
                  value={movie}
                >
                  {movie.poster_path ? (
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
                  <span className="ml-4">{movie.title}</span>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default MoviePicker

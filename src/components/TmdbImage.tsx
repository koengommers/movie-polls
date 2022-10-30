import Image, { ImageLoader, ImageProps } from 'next/image'

const widths = {
  backdrop: [300, 780, 1280],
  logo: [45, 92, 154, 185, 300, 500],
  poster: [92, 154, 185, 342, 500, 780],
  profile: [45, 185],
  still: [92, 185, 300]
}

type ImageType = keyof typeof widths

const getLoader = (type: ImageType): ImageLoader => {
  return ({ src, width }) => {
    const selectedWidth = widths[type].find(availableWidth => availableWidth >= width)
    const size = selectedWidth ? `w${selectedWidth}` : 'original'
    return `https://image.tmdb.org/t/p/${size}${src}`
  }
}

const TmdbImage = ({
  type,
  path,
  alt,
  ...props
}: {
  type: ImageType
  path: string
  alt: string
} & Omit<ImageProps, 'src' | 'loader'>) => {
  return (
    <Image
      src={path}
      alt={alt}
      loader={getLoader(type)}
      {...props}
    />
  )
}

export default TmdbImage

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { env } from '../../env/client.mjs'

const SharePage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Head>
        <title>Movie Polls</title>
        <meta name="description" content="Share your movie poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center">
        <h1 className="my-16 text-6xl font-medium">Share your movie poll</h1>
        <Link href={`/poll/${id}`}>
          <a>{ `${env.NEXT_PUBLIC_URL}/poll/${id}` }</a>
        </Link>
      </div>
    </>
  )
}

export default SharePage

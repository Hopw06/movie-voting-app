import React from 'react'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import MovieCards from './MovieCards'

const Page = async () => {
  const payload = await getPayload({ config: configPromise })

  const movies = await payload.find({
    collection: 'movie',
    sort: '-votes',
  })

  return (
    <>
      <main className="mt-5">
        <MovieCards movies={movies.docs} />
      </main>
    </>
  )
}

export default Page

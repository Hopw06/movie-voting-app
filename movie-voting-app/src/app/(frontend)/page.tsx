'use client'
import React, { useEffect, useState } from 'react'

import MovieCards from './MovieCards'
import Header from './Header'
import { useApi } from '@/components/api'
import { Movie } from '@/payload-types'

const Page = () => {
  const api = useApi()
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    api.post('/movie/list').then((resp) => {
      console.log(resp.data)
      setMovies(resp.data.movies)
    })
  }, [])

  return (
    <>
      <main className="mt-5">
        <Header />
        <MovieCards movies={movies} />
      </main>
    </>
  )
}

export default Page

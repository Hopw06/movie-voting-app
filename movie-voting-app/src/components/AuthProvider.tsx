'use client'
import { type PropsWithChildren, createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Next.js Router

interface AuthContextType {
  accessToken: string | null
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter() // Next.js navigation
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    async function getToken() {
      const res = await fetch('http://localhost:3000/api/users/auth/refresh', {
        credentials: 'include',
        method: 'post',
      })
      const data = await res.json()
      console.log('data', data)
      console.log(data.accessToken)
      if (data && data.accessToken) {
        console.log('here')
        setAccessToken(data.accessToken)
        router.push('/')
      } else {
        router.push('/login')
      }
    }
    getToken()
  }, [accessToken, router])

  useEffect(() => {
    if (!accessToken) {
      router.push('/login')
    }
  }, [accessToken, router])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

import React from 'react'
import './globals.scss'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/AuthProvider'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html className="dark mx-auto max-w-[1200px]">
      <body>
        <AuthProvider>
          <Toaster richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

export default Layout

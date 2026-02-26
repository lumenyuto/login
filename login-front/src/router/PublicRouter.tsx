import type { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const PublicRouter: FC<{children: ReactNode}> = ({ children }) => {
  const { authUser } = useAuth();

  if (authUser) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
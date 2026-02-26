import { createContext, useContext, useState, type FC, type ReactNode } from 'react'

type AuthUser = {
  name: string
}

type AuthContextType = {
  authUser: AuthUser | null
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  const login = (name: string) => {
    setAuthUser({ name })
  }

  const logout = () => {
    setAuthUser(null)
  }

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
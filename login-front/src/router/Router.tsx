import { Navigate, Route, Routes } from 'react-router-dom'
import { SigninPage } from '../components/SigninPage'
import { HomePage } from '../components/HomePage'
import { PrivateRouter } from './PrivateRouter'
import { PublicRouter } from './PublicRouter'
import { useAuth } from './AuthContext'

const Router = () => {
  const { authUser } = useAuth()

  return (
    <Routes>
      <Route 
        path="/"
        element={
          authUser 
            ? <Navigate to={`/${authUser.name}`} replace /> 
            : <Navigate to="/signin" replace />
        }
      />

      <Route
        path="/signin"
        element={
          <PublicRouter>
            <SigninPage />
          </PublicRouter>
        }
      />

      <Route 
        path="/:username"
        element={
          <PrivateRouter>
            <HomePage />
          </PrivateRouter>
        }
      />
      <Route path="*" element={<>PAGE NOT FOUND 404</>} />
    </Routes>
  )
}

export default Router
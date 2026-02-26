import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LandingPage } from '../pages/LandingPage'
import { SigninPage } from '../pages/SigninPage'
import { useAuth } from './AuthContext'
import { PrivateRouter } from './PrivateRouter'
import { GuestRouter } from './GuestRouter'

const Router = () => {
  const { authUser } = useAuth()
  return (
    <Routes>
      <Route 
        path="/"
        element={
          authUser ? <HomePage /> : <LandingPage />
        }
      />

      <Route
        path="/signin"
        element={
          <GuestRouter>
            <SigninPage />
          </GuestRouter>
        }
      />
      <Route
        path="/todos"
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
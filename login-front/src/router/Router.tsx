import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../components/HomePage'
import { LandingPage } from '../components/LandingPage'
import { SigninPage } from '../components/SigninPage'
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
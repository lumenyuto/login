import { Route, Routes } from 'react-router-dom'
import { SigninPage } from '../components/SigninPage'
import { HomePage } from '../components/HomePage'
import { PrivateRouter } from './PrivateRouter'
import { PublicRouter } from './PublicRouter'

const Router = () => {
  return (
    <Routes>
      <Route 
        path="/"
        element={
          <PrivateRouter>
            <HomePage />
          </PrivateRouter>
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
      <Route path="*" element={<>PAGE NOT FOUND 404</>} />
    </Routes>
  )
}

export default Router
import type { FC } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Stack, Typography } from '@mui/material'

export const LoginButton: FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return !isAuthenticated ? (
    <Button
      variant="contained" 
      size="large"
      onClick={() => loginWithRedirect}
    >
      ログイン
    </Button>
  ) : null
}
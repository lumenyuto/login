import { useState, useEffect, type FC } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { createUser, getUserItems } from '../api/user'
import type { User } from '../types/user'

export const HomePage: FC = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    ;(async () => {
      if (!isAuthenticated || !user) return
      const token = await getAccessTokenSilently()
      await createUser(
        {
          sub: user.sub!,
          name: user.name ?? '',
          email: user.email ?? '',
        },
        token,
      )
      const users = await getUserItems(token)
      setUsers(users)
    })()
  }, [isAuthenticated, getAccessTokenSilently, user])

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!isAuthenticated || !user) return null

  return (
    <>
      <Box
        component="header"
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 64,
        }}
      >
        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />

        <Typography
          variant="h1"
          component="h1"
          sx={{
            textAlign: 'center',
            flex: 1,
          }}
        >
          My App
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          gap={2}
          sx={{ flex: 1 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {user.name} さん
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </>
  )
}
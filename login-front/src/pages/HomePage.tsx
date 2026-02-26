import { useState, useEffect, type FC } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useAuth } from '../router/AuthContext'
import { addUserItem, getUserItems } from '../api/user'
import type { NewUserPayload, User } from '../types/user'

export const HomePage: FC = () => {
  const { authUser, logout } = useAuth()
  const [users, setUsers] = useState<User []>([])

  const onSubmit = async (payload: NewUserPayload) => {
    if (!payload.name) return 
    await addUserItem(payload)
    const users = await getUserItems()
    setUsers(users)
  }

  useEffect(() => {
    ;(async () => {
      const users = await getUserItems()
      setUsers(users)
    }) ()
  }, [])

  if (!authUser) return null

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
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 700,
            letterSpacing: '.1rem',
            textAlign: 'center',
            flex: 1,
          }}
        >
          MY APP
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          gap={2}
          sx={{ flex: 1 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {authUser.name} さん
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={logout}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </>
  )
}
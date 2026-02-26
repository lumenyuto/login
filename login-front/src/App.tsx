import { useEffect, useState, type FC } from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import { Box, Button, Stack, Typography} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import type { NewUserPayload, User } from './types/user'
import {
  addUserItem,
  getUserItems,
} from './lib/api/user'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SigninPage } from './components/SigninPage'

const MyApp: FC = () => {
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

  if (!authUser) {
    return <SigninPage />
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 64,
          px: 3,
          boxSizing: 'border-box',
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

const theme = createTheme({
  typography: {
    h1: {
      fontSize: 30,
    },
    h2: {
      fontSize: 20,
    },
  },
})

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MyApp />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
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
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid gray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          p: 2,
          width: '100%',
          height: 80,
          zIndex: 3,
        }}
      >
        <Typography variant="h1">My App</Typography>
        <Stack direction="row" alignItems="center" gap={2} sx={{ pr: 4 }}>
          <Typography variant="body1">{authUser.name} さん</Typography>
          <Button variant="outlined" size="small" onClick={logout}>
            ログアウト
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
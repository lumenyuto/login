import { useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useAuth } from '../router/AuthContext'
import { addUserItem, getUserItems } from '../lib/api/user'

export const SigninPage: FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSignin = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('名前を入力してください')
      return
    }

    const users = await getUserItems()
    const exists = users.find((u) => u.name === trimmed)
    if (!exists) {
      await addUserItem({ name: trimmed })
    }

    login(trimmed)
    navigate('/')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2,
      }}
    >
      <Typography variant="h1">My App</Typography>
      <Typography variant="h2" color="text.secondary">
        名前を入力してサインイン
      </Typography>
      <TextField
        label="名前"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          setError('')
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSignin()}
        error={!!error}
        helperText={error}
        sx={{ width: 300 }}
      />
      <Button variant="contained" onClick={handleSignin} sx={{ width: 300 }}>
        ログイン
      </Button>
    </Box>
  )
}
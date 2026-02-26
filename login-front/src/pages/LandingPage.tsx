import type { FC } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const LandingPage: FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        gap: 4,
      }}
    >
      <Typography variant="h2" fontWeight="bold">
        Welcome to My App!
      </Typography>
      
      <Button 
        variant="contained" 
        size="large" 
        onClick={() => navigate('/signin')}
      >
        ログインして始める
      </Button>
    </Box>
  )
}
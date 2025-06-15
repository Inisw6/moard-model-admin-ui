import React from 'react';
import { ThemeProvider, createTheme, AppBar, Toolbar, Typography, Box, CssBaseline, Button, IconButton } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Dashboard from './components/Dashboard/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#191F28',
    },
    secondary: {
      main: '#191F28',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#191F28',
      secondary: '#8B95A1',
    },
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, sans-serif',
    h5: {
      fontSize: '1.125rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: 'none',
          padding: '8px 16px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* 헤더 */}
        <AppBar position="fixed" sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Toolbar sx={{ height: 72, px: { xs: 2, md: 4 } }}>
            {/* 로고 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '12px',
                background: '#191F28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SmartToyOutlinedIcon sx={{ fontSize: 20, color: '#FFFFFF' }}/>
              </Box>
              <Typography sx={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: 'text.primary'
              }}>
                AI Model Hub
              </Typography>
            </Box>
            
            {/* 네비게이션 버튼 */}
            <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#F2F4F6',
                  color: 'text.primary',
                  '&:hover': { 
                    bgcolor: '#E5E8EB',
                  },
                  '&:active': {
                    bgcolor: '#D1D6DB',
                  }
                }}
              >
                대시보드
              </Button>
              <Button 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    bgcolor: '#F2F4F6',
                  },
                  '&:active': {
                    bgcolor: '#E5E8EB',
                  }
                }}
              >
                로그 관리
              </Button>
              <Button 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    bgcolor: '#F2F4F6',
                  },
                  '&:active': {
                    bgcolor: '#E5E8EB',
                  }
                }}
              >
                모델 관리
              </Button>
            </Box>

            {/* 우측 아이콘 */}
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ 
                  bgcolor: '#F2F4F6',
                  border: '1px solid rgba(0,0,0,0.06)',
                  '&:hover': { 
                    bgcolor: '#E5E8EB',
                  },
                  '&:active': {
                    bgcolor: '#D1D6DB',
                  }
                }}
              >
                <NotificationsNoneIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
              <IconButton 
                sx={{ 
                  bgcolor: '#F2F4F6',
                  border: '1px solid rgba(0,0,0,0.06)',
                  '&:hover': { 
                    bgcolor: '#E5E8EB',
                  },
                  '&:active': {
                    bgcolor: '#D1D6DB',
                  }
                }}
              >
                <AccountCircleOutlinedIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* 메인 컨텐츠 */}
        <Box component="main" sx={{ flexGrow: 1, pt: '88px', px: { xs: 2, md: 4 }, pb: 4 }}>
          <Dashboard />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 
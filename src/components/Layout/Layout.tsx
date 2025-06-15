import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
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
              Moard Dashboard
            </Typography>
          </Box>
          
          {/* 네비게이션 버튼 */}
          <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
            <Button 
              variant={isActive('/') ? "contained" : "text"}
              onClick={() => navigate('/')}
              sx={{ 
                bgcolor: isActive('/') ? '#F2F4F6' : 'transparent',
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
              variant={isActive('/logs') ? "contained" : "text"}
              onClick={() => navigate('/logs')}
              sx={{ 
                bgcolor: isActive('/logs') ? '#F2F4F6' : 'transparent',
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
              variant={isActive('/model') ? "contained" : "text"}
              onClick={() => navigate('/model')}
              sx={{ 
                bgcolor: isActive('/model') ? '#F2F4F6' : 'transparent',
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
      <Box component="main" sx={{ flexGrow: 1, pt: '88px' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 
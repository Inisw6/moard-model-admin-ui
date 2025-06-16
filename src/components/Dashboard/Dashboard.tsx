import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, useTheme, Button, CircularProgress, Theme } from '@mui/material';
import styled from '@emotion/styled';
import HistoryIcon from '@mui/icons-material/History';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';

const Section = styled(Paper)`
  height: 100%;
  min-height: 640px;
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 100%);
    pointer-events: none;
  }
`;

const SectionContent = styled(Box)`
  padding: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  justify-content: center;
`;

const IconWrapper = styled(Box)<{ theme: Theme }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => `${theme.palette.primary.main}10`};
  color: ${({ theme }) => theme.palette.primary.main};
  transition: all 0.3s ease;
`;

const StatsBox = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2rem 0;
`;

const StatItem = styled(Box)<{ theme: Theme }>`
  padding: 2rem;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  height: 240px;

  &:hover {
    background: ${({ theme }) => theme.palette.background.paper};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  }
`;

const ActionButton = styled(Button)<{ theme: Theme }>`
  padding: 1rem 2rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  background: ${({ theme }) => theme.palette.primary.main};
  color: #FFFFFF;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px ${({ theme }) => `${theme.palette.primary.main}40`};

  &:hover {
    background: ${({ theme }) => theme.palette.primary.dark};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${({ theme }) => `${theme.palette.primary.main}60`};
  }

  &:active {
    transform: translateY(0);
  }
`;

interface User {
  id: number;
  uuid: string;
  userLogList: Array<{
    id: number;
    timestamp: string;
    time: number;
    ratio: number;
    eventType: string;
  }>;
  recommendationList: Array<{
    id: number;
    recommendedAt: string;
    modelVersion: string;
    query: string;
    flag: boolean;
  }>;
  stockLogList: Array<{
    id: number;
    stockName: string;
    user: string;
    viewedAt: string;
  }>;
}

interface ModelResponse {
  models: string[];
  current_model: string;
  message: string;
}

interface ModelStatistics {
  modelVersion: string;
  totalRecommendations: number;
  totalClicks: number;
}

interface ModelInfo {
  version: string;
  clickRate: number;
  totalClicks: number;
  totalViews: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState<number>(0);
  const [logCount, setLogCount] = useState<number>(0);
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    version: 'v1.0.0',
    clickRate: 0,
    totalClicks: 0,
    totalViews: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 회원 수 가져오기
        const usersResponse = await fetch('http://localhost:8080/api/v1/users');
        const users: User[] = await usersResponse.json();
        setUserCount(users.length);
        
        // 로그 수 가져오기
        const logCountResponse = await fetch('http://localhost:8080/api/v1/user-log/count');
        const logCount: number = await logCountResponse.json();
        setLogCount(logCount);
        
        // 모델 정보 가져오기
        const modelResponse = await fetch('http://localhost:8000/api/v1/model/list');
        const modelData: ModelResponse = await modelResponse.json();
        
        // 모델별 추천 통계 가져오기
        const statsResponse = await fetch('http://localhost:8080/api/v1/recommendations/statistics/models');
        const modelStats: ModelStatistics[] = await statsResponse.json();
        
        // 현재 모델의 통계 찾기
        const currentModelStats = modelStats.find(stat => stat.modelVersion === modelData.current_model) || {
          totalRecommendations: 0,
          totalClicks: 0
        };
        
        setModelInfo({
          version: modelData.current_model,
          clickRate: currentModelStats.totalRecommendations > 0 
            ? (currentModelStats.totalClicks / currentModelStats.totalRecommendations) * 100 
            : 0,
          totalClicks: currentModelStats.totalClicks,
          totalViews: currentModelStats.totalRecommendations
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 88px)', 
      py: 4,
      px: 3,
      background: theme.palette.background.default
    }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Grid item xs={12} lg={6}>
          <Section>
            <SectionContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mb: 2
              }}>
                <IconWrapper theme={theme}>
                  <HistoryIcon sx={{ fontSize: 28 }} />
                </IconWrapper>
                <Typography variant="h4" sx={{ 
                  color: 'text.primary', 
                  fontWeight: 700,
                  fontSize: '1.75rem'
                }}>
                  로그 관리
                </Typography>
              </Box>
              <StatsBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <StatItem theme={theme}>
                      <Typography sx={{ 
                        color: 'text.secondary', 
                        mb: 1.5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}>
                        현재 회원 수
                      </Typography>
                      <Box sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <Typography sx={{ 
                          color: 'text.primary', 
                          fontSize: '2rem', 
                          fontWeight: 700,
                          letterSpacing: '-1px',
                          textAlign: 'center',
                          wordBreak: 'break-all',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}>
                          {userCount.toLocaleString()}
                        </Typography>
                      </Box>
                    </StatItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StatItem theme={theme}>
                      <Typography sx={{ 
                        color: 'text.secondary', 
                        mb: 1.5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}>
                        오늘의 로그 수
                      </Typography>
                      <Box sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <Typography sx={{ 
                          color: 'text.primary', 
                          fontSize: '2rem', 
                          fontWeight: 700,
                          letterSpacing: '-1px',
                          textAlign: 'center',
                          wordBreak: 'break-all',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}>
                          {logCount.toLocaleString()}
                        </Typography>
                      </Box>
                    </StatItem>
                  </Grid>
                </Grid>
              </StatsBox>
              <ActionButton 
                variant="contained" 
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 20 }} />} 
                theme={theme}
                onClick={() => navigate('/logs')}
              >
                로그 관리하기
              </ActionButton>
            </SectionContent>
          </Section>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Section>
            <SectionContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mb: 2
              }}>
                <IconWrapper theme={theme}>
                  <PrecisionManufacturingIcon sx={{ fontSize: 28 }} />
                </IconWrapper>
                <Typography variant="h4" sx={{ 
                  color: 'text.primary', 
                  fontWeight: 700,
                  fontSize: '1.75rem'
                }}>
                  모델 관리
                </Typography>
              </Box>
              <StatsBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <StatItem theme={theme}>
                      <Typography sx={{ 
                        color: 'text.secondary', 
                        mb: 1.5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}>
                        현재 모델
                      </Typography>
                      <Box sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <Typography 
                          variant="h3" 
                          component="div" 
                          sx={{ 
                            fontSize: '1.75rem',
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            mb: 1,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textAlign: 'center',
                            lineHeight: 1.3
                          }}
                        >
                          {modelInfo.version}
                        </Typography>
                      </Box>
                    </StatItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StatItem theme={theme}>
                      <Typography sx={{ 
                        color: 'text.secondary', 
                        mb: 1.5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}>
                        클릭률
                      </Typography>
                      <Box sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CircularProgress
                            variant="determinate"
                            value={modelInfo.clickRate}
                            size={120}
                            thickness={6}
                            sx={{
                              color: theme.palette.primary.main,
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                              },
                            }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                          }}>
                            <Typography sx={{ 
                              color: 'text.primary', 
                              fontSize: '2rem', 
                              fontWeight: 700,
                              lineHeight: 1,
                              letterSpacing: '-1px'
                            }}>
                              {modelInfo.clickRate.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                          mt: 2,
                          letterSpacing: '0.5px'
                        }}>
                          총 {modelInfo.totalClicks.toLocaleString()}회 클릭 / {modelInfo.totalViews.toLocaleString()}회 조회
                        </Typography>
                      </Box>
                    </StatItem>
                  </Grid>
                </Grid>
              </StatsBox>
              <ActionButton variant="contained" endIcon={<ArrowForwardIosIcon sx={{ fontSize: 20 }} />} theme={theme}>
                모델 관리하기
              </ActionButton>
            </SectionContent>
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 
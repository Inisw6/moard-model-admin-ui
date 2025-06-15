import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, Button } from '@mui/material';
import styled from '@emotion/styled';
import HistoryIcon from '@mui/icons-material/History';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Section = styled(Paper)`
  height: 100%;
  min-height: 640px;
  background: #FFFFFF;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
`;

const SectionContent = styled(Box)`
  padding: 3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const IconWrapper = styled(Box)`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background: #F2F4F6;
  border: 1px solid rgba(0,0,0,0.06);
`;

const StatsBox = styled(Box)`
  margin-top: auto;
  padding: 3rem;
  background: #F2F4F6;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.06);
`;

const StatsGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const StatItem = styled(Box)`
  padding: 2rem;
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.06);
`;

const ActionButton = styled(Button)`
  margin-top: auto;
  padding: 1.25rem 2.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.125rem;
  background: #191F28;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px);
    background: #2A3441;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 88px)', 
      display: 'flex', 
      alignItems: 'center',
      py: 6
    }}>
      <Grid container spacing={4} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* 왼쪽 로그 관리 섹션 */}
        <Grid item xs={12} lg={6}>
          <Section>
            <SectionContent>
              <IconWrapper>
                <HistoryIcon sx={{ fontSize: 40, color: '#191F28' }} />
              </IconWrapper>
              <Typography variant="h4" sx={{ color: 'text.primary', mb: 2, fontWeight: 700 }}>
                로그 관리
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6, fontSize: '1.125rem' }}>
                AI 모델의 실행 로그를 실시간으로 모니터링하고 관리합니다.
              </Typography>
              <StatsBox>
                <StatsGrid>
                  <StatItem>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: '1.125rem', fontWeight: 500 }}>
                      현재 회원 수
                    </Typography>
                    <Typography sx={{ 
                      color: 'text.primary', 
                      fontSize: '3.5rem', 
                      fontWeight: 700,
                    }}>
                      1,024
                    </Typography>
                  </StatItem>
                  <StatItem>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: '1.125rem', fontWeight: 500 }}>
                      오늘의 로그 수
                    </Typography>
                    <Typography sx={{ 
                      color: 'text.primary', 
                      fontSize: '3.5rem', 
                      fontWeight: 700,
                    }}>
                      1,284
                    </Typography>
                  </StatItem>
                </StatsGrid>
              </StatsBox>
            </SectionContent>
          </Section>
        </Grid>

        {/* 오른쪽 모델 관리 섹션 */}
        <Grid item xs={12} lg={6}>
          <Section>
            <SectionContent>
              <IconWrapper>
                <PrecisionManufacturingIcon sx={{ fontSize: 40, color: '#191F28' }} />
              </IconWrapper>
              <Typography variant="h4" sx={{ color: 'text.primary', mb: 2, fontWeight: 700 }}>
                모델 관리
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6, fontSize: '1.125rem' }}>
                AI 모델의 버전 관리와 배포를 손쉽게 제어합니다.
              </Typography>
              <ActionButton variant="contained" endIcon={<ArrowForwardIosIcon sx={{ fontSize: 24 }} />}>
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
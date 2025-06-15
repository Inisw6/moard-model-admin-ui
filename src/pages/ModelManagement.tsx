import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import styled from '@emotion/styled';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const PageContainer = styled(Box)`
  min-height: calc(100vh - 88px);
  padding: 2rem;
  background: ${({ theme }: { theme: Theme }) => theme.palette.background.default};
`;

const HeaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
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

const ModelManagement: React.FC = () => {
  const theme = useTheme();

  return (
    <PageContainer theme={theme}>
      <HeaderContainer>
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
      </HeaderContainer>
    </PageContainer>
  );
};

export default ModelManagement; 
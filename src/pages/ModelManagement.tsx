import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  styled,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { Theme } from '@mui/material/styles';

interface ModelStats {
  modelVersion: string;
  totalRecommendations: number;
  totalClicks: number;
}

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

const StyledTableContainer = styled(TableContainer)({
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(0,0,0,0.06)'
  }
});

const StyledCard = styled(Card)({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  padding: 24,
  height: '100%',
  minHeight: 250
});

export default function ModelManagement() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [modelStats, setModelStats] = useState<ModelStats[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchModelStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/recommendations/statistics/models');
      setModelStats(response.data);
    } catch (err) {
      setError('모델 통계를 불러오는데 실패했습니다.');
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // 모델 학습 API 호출
      const response = await axios.post('/api/model/train');
      setSuccess('모델 학습이 완료되었습니다.');
    } catch (err) {
      setError('모델 학습에 실패했습니다.');
    } finally {
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  const handleApplyModel = async () => {
    if (!selectedModel) {
      setError('적용할 모델을 선택해주세요.');
      return;
    }

    try {
      await axios.post('/api/model/apply', { modelVersion: selectedModel });
      setSuccess('모델이 성공적으로 적용되었습니다.');
    } catch (err) {
      setError('모델 적용에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchModelStats();
  }, []);

  return (
    <PageContainer theme={theme}>
      {/* 상단 네비게이션 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* 왼쪽: 모델 통계 */}
        <StyledCard>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            모델 통계
          </Typography>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>모델 버전</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>추천 횟수</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>클릭 횟수</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>클릭률</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modelStats.map((stat) => (
                  <TableRow key={stat.modelVersion}>
                    <TableCell>{stat.modelVersion}</TableCell>
                    <TableCell>{stat.totalRecommendations}</TableCell>
                    <TableCell>{stat.totalClicks}</TableCell>
                    <TableCell>
                      {((stat.totalClicks / stat.totalRecommendations) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </StyledCard>

        {/* 오른쪽: 모델 학습 및 적용 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 모델 학습 */}
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              모델 학습
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {isTraining && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} />
                  <Typography>모델 학습 중... {trainingProgress}%</Typography>
                </Box>
              )}
              <Button
                variant="contained"
                onClick={handleTrainModel}
                disabled={isTraining}
                sx={{ alignSelf: 'flex-start' }}
              >
                모델 학습 시작
              </Button>
            </Box>
          </StyledCard>

          {/* 모델 적용 */}
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              모델 적용
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                label="적용할 모델 선택"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                SelectProps={{
                  native: true
                }}
                fullWidth
              >
                <option value="">선택하세요</option>
                {modelStats.map((stat) => (
                  <option key={stat.modelVersion} value={stat.modelVersion}>
                    {stat.modelVersion}
                  </option>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={handleApplyModel}
                disabled={!selectedModel}
                sx={{ alignSelf: 'flex-start' }}
              >
                모델 적용하기
              </Button>
            </Box>
          </StyledCard>
        </Box>
      </Box>

      {/* 알림 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </PageContainer>
  );
} 
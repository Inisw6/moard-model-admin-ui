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
  useTheme,
  Snackbar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { Theme } from '@mui/material/styles';
import { ArrowBack } from '@mui/icons-material';

interface ModelStats {
  modelVersion: string;
  totalRecommendations: number;
  totalClicks: number;
}

interface ModelList {
  models: string[];
  current_model: string;
  message: string;
}

interface LearningTask {
  task_id: string;
  status: string;
  start_time: string;
  end_time: string;
  total_interactions: number;
  processed_interactions: number;
  results: Array<{
    q_value: number;
    loss: number;
  }>;
  total_loss: number;
  error: string | null;
  save_path: string;
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
  const [modelList, setModelList] = useState<ModelList | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [latestTraining, setLatestTraining] = useState<LearningTask | null>(null);

  const fetchModelStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/recommendations/statistics/models');
      const data = await response.json();
      setModelStats(data);
    } catch (err) {
      setError('모델 통계를 불러오는데 실패했습니다.');
    }
  };

  const fetchModelList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/model/list');
      const data = await response.json();
      setModelList(data);
      setSelectedModel(data.current_model);
    } catch (err) {
      setError('모델 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchLatestTraining = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/online-learning/tasks');
      const data: LearningTask[] = await response.json();
      const completedTasks = data.filter(task => task.status === 'completed');
      if (completedTasks.length > 0) {
        // 가장 최근 완료된 작업 찾기
        const latestTask = completedTasks.reduce((latest, current) => {
          return new Date(current.end_time) > new Date(latest.end_time) ? current : latest;
        });
        setLatestTraining(latestTask);
      }
    } catch (err) {
      setError('학습 정보를 불러오는데 실패했습니다.');
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
      const response = await fetch(`http://localhost:8000/api/v1/model/change?model_name=${selectedModel}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('모델 적용에 실패했습니다.');
      }
      
      setSuccess('모델이 성공적으로 적용되었습니다.');
      // 모델 목록 새로고침
      fetchModelList();
    } catch (err) {
      setError('모델 적용에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchModelStats();
    fetchModelList();
    fetchLatestTraining();
  }, []);

  return (
    <PageContainer theme={theme}>
      {/* 상단 네비게이션 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {/* 왼쪽: 모델 통계 */}
        <StyledCard>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 모델 학습 */}
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              모델 학습
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {isTraining && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} />
                  <Typography>모델 학습 중... {trainingProgress}%</Typography>
                </Box>
              )}

              {latestTraining && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    학습 리스트
                  </Typography>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>시작 시간</TableCell>
                          <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>저장 경로</TableCell>
                          <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>총 손실값</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{new Date(latestTraining.start_time).toLocaleString()}</TableCell>
                          <TableCell sx={{ wordBreak: 'break-all' }}>{latestTraining.save_path}</TableCell>
                          <TableCell>{latestTraining.total_loss.toFixed(4)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleTrainModel}
                disabled={isTraining}
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              >
                모델 학습 시작
              </Button>
            </Box>
          </StyledCard>

          {/* 모델 적용 */}
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
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
                {modelList?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={handleApplyModel}
                disabled={!selectedModel || selectedModel === modelList?.current_model}
                sx={{ alignSelf: 'flex-start' }}
              >
                모델 적용하기
              </Button>
            </Box>
          </StyledCard>
        </Box>
      </Box>

      {/* 알림 메시지 */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
} 
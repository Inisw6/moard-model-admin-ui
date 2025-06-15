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
  Snackbar,
  Tabs,
  Tab,
  IconButton,
  Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { Theme } from '@mui/material/styles';
import { ArrowBack } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

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
  flex: 1,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555'
    }
  }
});

const StyledCard = styled(Card)({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  padding: 24,
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
});

const CardContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555'
    }
  }
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
  const [activeTab, setActiveTab] = useState(0);
  const [trainingTasks, setTrainingTasks] = useState<LearningTask[]>([]);

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
      setTrainingTasks(data);
      if (data.length > 0) {
        // 가장 최근 완료된 작업 찾기
        const completedTasks = data.filter(task => task.status === 'completed');
        if (completedTasks.length > 0) {
          const latestTask = completedTasks.reduce((latest, current) => {
            return new Date(current.end_time!) > new Date(latest.end_time!) ? current : latest;
          });
          setLatestTraining(latestTask);
        }
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/online-learning/async-batch-status/${taskId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccess('학습 작업이 삭제되었습니다.');
        fetchLatestTraining(); // 목록 새로고침
      } else {
        setError('학습 작업 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('학습 작업 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteModel = async (modelName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/model/${modelName}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccess('모델이 삭제되었습니다.');
        fetchModelList(); // 모델 목록 새로고침
      } else {
        setError('모델 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('모델 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchModelStats();
    fetchModelList();
    fetchLatestTraining();

    // 3초마다 학습 작업 목록 업데이트
    const intervalId = setInterval(() => {
      fetchLatestTraining();
    }, 3000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(intervalId);
    };
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

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="model management tabs">
            <Tab label="모델 통계" />
            <Tab label="모델 학습" />
            <Tab label="모델 적용" />
          </Tabs>
        </Box>

        {/* 모델 통계 */}
        {activeTab === 0 && (
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
        )}

        {/* 모델 학습 */}
        {activeTab === 1 && (
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              모델 학습
            </Typography>
            <CardContent>
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
                            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>상태</TableCell>
                            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>저장 경로</TableCell>
                            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>총 손실값</TableCell>
                            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>작업</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {trainingTasks.map((task) => (
                            <TableRow key={task.task_id}>
                              <TableCell>{new Date(task.start_time).toLocaleString()}</TableCell>
                              <TableCell>
                                {task.status === 'processing' ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="body2">진행중</Typography>
                                  </Box>
                                ) : (
                                  task.status
                                )}
                              </TableCell>
                              <TableCell sx={{ wordBreak: 'break-all' }}>
                                {task.save_path || '-'}
                              </TableCell>
                              <TableCell>
                                {task.total_loss !== null ? task.total_loss.toFixed(4) : '-'}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteTask(task.task_id)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
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
            </CardContent>
          </StyledCard>
        )}

        {/* 모델 적용 */}
        {activeTab === 2 && (
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              모델 적용
            </Typography>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  현재 적용된 모델: {modelList?.current_model || '없음'}
                </Typography>
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    boxShadow: 'none', 
                    border: '1px solid', 
                    borderColor: 'divider'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>모델명</TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>상태</TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>작업</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modelList?.models.map((model) => (
                        <TableRow 
                          key={model}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'action.hover',
                              cursor: 'pointer'
                            }
                          }}
                        >
                          <TableCell>{model}</TableCell>
                          <TableCell>
                            {model === modelList.current_model ? (
                              <Chip 
                                label="현재 적용됨" 
                                color="primary" 
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            ) : (
                              <Chip 
                                label="미적용" 
                                variant="outlined" 
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setSelectedModel(model);
                                  handleApplyModel();
                                }}
                                disabled={model === modelList.current_model}
                              >
                                적용하기
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteModel(model)}
                                disabled={model === modelList.current_model}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </StyledCard>
        )}
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
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import styled from '@emotion/styled';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

interface UserLog {
  id: number;
  timestamp: string;
  time: number | null;
  ratio: number | null;
  eventType: 'CLICK' | 'VIEW';
}

interface Recommendation {
  id: number;
  recommendedAt: string;
  modelVersion: string;
  query: string;
  flag: boolean;
}

interface StockLog {
  id: number;
  stockName: string;
  viewedAt: string;
}

interface User {
  id: number;
  uuid: string;
  userLogList: UserLog[];
  recommendationList: Recommendation[];
  stockLogList: StockLog[];
}

const PageContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  minHeight: 'calc(100vh - 88px)',
  padding: '2rem',
  background: theme.palette.background.default
}));

const HeaderContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  marginBottom: '2rem'
});

const IconWrapper = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${theme.palette.primary.main}10`,
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease'
}));

const StyledCard = styled(Card)({
  height: '100%',
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  }
});

const StyledTableContainer = styled(TableContainer)({
  borderRadius: 12,
  overflow: 'hidden',
  marginTop: '1rem'
});

const UserCard = styled(Card)({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transform: 'translateY(-2px)'
  }
});

const LogManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/users');
      setUsers(response.data);
      if (response.data.length > 0 && !selectedUser) {
        setSelectedUser(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <HeaderContainer>
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
        <IconButton 
          onClick={fetchData}
          sx={{ 
            ml: 'auto',
            bgcolor: '#F2F4F6',
            '&:hover': { bgcolor: '#E5E8EB' }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </HeaderContainer>

      <Grid container spacing={3}>
        {/* 사용자 목록 */}
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            사용자 목록
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {users.map((user) => (
              <UserCard 
                key={user.uuid}
                onClick={() => setSelectedUser(user)}
                sx={{ 
                  bgcolor: selectedUser?.uuid === user.uuid ? '#F2F4F6' : 'white',
                  border: selectedUser?.uuid === user.uuid ? '2px solid #191F28' : 'none'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.uuid.slice(0, 8)}...
                    </Typography>
                    <Badge 
                      badgeContent={user.userLogList.length} 
                      color="primary"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                </CardContent>
              </UserCard>
            ))}
          </Box>
        </Grid>

        {/* 선택된 사용자의 로그 정보 */}
        <Grid item xs={12} md={9}>
          {selectedUser && (
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    사용자 ID: {selectedUser.uuid}
                  </Typography>
                  <Tooltip title="사용자별 로그 정보">
                    <InfoOutlinedIcon sx={{ ml: 1, color: 'text.secondary', fontSize: 20 }} />
                  </Tooltip>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Tabs 
                  value={activeTab} 
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{ mb: 2 }}
                >
                  <Tab label="사용자 로그" />
                  <Tab label="추천 로그" />
                  <Tab label="주식 로그" />
                </Tabs>

                {/* 사용자 로그 */}
                {activeTab === 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      사용자 로그
                    </Typography>
                    <StyledTableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>시간</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>이벤트</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>시간(ms)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUser.userLogList.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{formatDate(log.timestamp)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={log.eventType} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: log.eventType === 'CLICK' ? '#E3F2FD' : '#E8F5E9',
                                    color: log.eventType === 'CLICK' ? '#1976D2' : '#2E7D32',
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                              <TableCell>{log.time || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </>
                )}

                {/* 추천 로그 */}
                {activeTab === 1 && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      추천 로그
                    </Typography>
                    <StyledTableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>시간</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>모델 버전</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>검색어</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUser.recommendationList.map((rec) => (
                            <TableRow key={rec.id}>
                              <TableCell>{formatDate(rec.recommendedAt)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={rec.modelVersion} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: rec.modelVersion === 'random' ? '#FFF3E0' : '#E8EAF6',
                                    color: rec.modelVersion === 'random' ? '#E65100' : '#3F51B5',
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                              <TableCell>{rec.query}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </>
                )}

                {/* 주식 로그 */}
                {activeTab === 2 && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      주식 로그
                    </Typography>
                    <StyledTableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>시간</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>주식명</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUser.stockLogList.map((stock) => (
                            <TableRow key={stock.id}>
                              <TableCell>{formatDate(stock.viewedAt)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={stock.stockName} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#E3F2FD',
                                    color: '#1976D2',
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </>
                )}
              </CardContent>
            </StyledCard>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default LogManagement; 
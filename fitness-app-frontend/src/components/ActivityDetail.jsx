import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getActivityDetail } from '../services/api';
import { Box, Divider, Typography, Container, Paper, Stack, Button, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { formatActivityDate, getActivityIcon } from '../utils/activityUtils.jsx';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityDetail();
  }, [id]);

  const activeTheme = useTheme();
  const isDark = activeTheme.palette.mode === 'dark';

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography>Loading activity details...</Typography>
    </Container>
  );

  if (!activity) return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6">Activity not found.</Typography>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/activities')} sx={{ mt: 2 }}>
        Back to Activities
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/activities')}
        sx={{ mb: 4, color: 'text.secondary', fontWeight: 600 }}
      >
        Back to Activities
      </Button>

      <Grid container spacing={4}>
        {/* Main Stats Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
            bgcolor: 'background.paper',
            opacity: 0.95,
            backdropFilter: 'blur(12px)',
          }}>
            <Box sx={{
              display: 'inline-flex',
              p: 2.5,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              mb: 3,
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
            }}>
              {getActivityIcon(activity.type, { sx: { fontSize: 40 } })}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>{activity.type}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 4, color: 'text.secondary' }}>
              <CalendarMonthIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatActivityDate(activity, { dateStyle: 'long', timeStyle: 'short' })}
              </Typography>
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TimerIcon color="primary" />
                  <Typography fontWeight={600}>Duration</Typography>
                </Box>
                <Typography fontWeight={700}>{activity.duration} min</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocalFireDepartmentIcon sx={{ color: 'error.main' }} />
                  <Typography fontWeight={600}>Calories</Typography>
                </Box>
                <Typography fontWeight={700}>{activity.caloriesBurned} kcal</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* AI Insights Section */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
              background: isDark
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, right: 0,
                width: '150px', height: '150px',
                background: isDark
                  ? 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, rgba(30,41,59,0) 70%)'
                  : 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <AutoAwesomeIcon color="secondary" />
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>AI Insights</Typography>
            </Box>

            {activity.recommendation ? (
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 700 }}>Analysis</Typography>
                <Typography paragraph color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {activity.recommendation}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {activity.improvements && activity.improvements.length > 0 && (
                  <>
                    <Typography variant="h6" color="secondary" gutterBottom sx={{ fontWeight: 700 }}>Recommended Fixes</Typography>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      {activity.improvements.map((improvement, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
                          <Typography color="secondary" fontWeight={900}>•</Typography>
                          <Typography color="text.secondary">{improvement}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </>
                )}

                {activity.suggestions && activity.suggestions.length > 0 && (
                  <>
                    <Typography variant="h6" color="primary.dark" gutterBottom sx={{ fontWeight: 700 }}>Pro Suggestions</Typography>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      {activity.suggestions.map((suggestion, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
                          <Typography color="primary" fontWeight={900}>•</Typography>
                          <Typography color="text.secondary">{suggestion}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </>
                )}

                {activity.safety && activity.safety.length > 0 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: 2, borderLeft: '4px solid #ef4444' }}>
                    <Typography variant="subtitle2" color="error" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      Safety Guidelines
                    </Typography>
                    {activity.safety.map((safety, index) => (
                      <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>• {safety}</Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.disabled">No AI analysis available for this activity.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ActivityDetail
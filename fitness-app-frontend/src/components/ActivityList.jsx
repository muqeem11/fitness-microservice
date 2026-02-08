import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { formatActivityDate, getActivityIcon } from '../utils/activityUtils.jsx';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      // Sort activities by date (most recent first)
      const sorted = [...response.data].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.creationTime || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.creationTime || b.timestamp || 0);
        return dateB - dateA;
      });
      setActivities(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) return <Typography sx={{ py: 4, textAlign: 'center' }}>Loading activities...</Typography>;

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'action.hover', borderRadius: 4, border: '2px dashed', borderColor: 'divider' }}>
        <Typography variant="h6" color="text.secondary">No activities found. Start by adding one above!</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              bgcolor: 'background.paper',
              opacity: 0.95,
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'transparent',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 12px 24px -10px ${theme.palette.divider}`,
                borderColor: 'primary.light',
              }
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                  }}>
                    {getActivityIcon(activity.type, { sx: { fontSize: 22 } })}
                  </Box>
                  <Typography variant='h6' sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>{activity.type}</Typography>
                </Box>
                <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
                  <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Tooltip title="Duration">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                    <TimerIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.duration} min</Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Calories Burned">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.caloriesBurned} kcal</Typography>
                  </Box>
                </Tooltip>
              </Box>

              <Box sx={{
                mt: 'auto',
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.disabled'
              }}>
                <CalendarMonthIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {formatActivityDate(activity, { dateStyle: 'medium', timeStyle: 'short' })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ActivityList
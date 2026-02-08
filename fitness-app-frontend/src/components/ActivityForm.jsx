import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Typography, InputAdornment } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import { addActivity } from '../services/api'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const ActivityForm = ({ onActivityAdded }) => {
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState({
        type: "RUNNING", duration: '', caloriesBurned: '',
        additionalMetrics: {}
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addActivity(activity);
            onActivityAdded();
            setActivity({ type: "RUNNING", duration: '', caloriesBurned: '' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Paper elevation={0} sx={{
            p: 4,
            mb: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            bgcolor: 'background.paper',
            opacity: 0.95,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Add New Activity</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>Activity Type</InputLabel>
                            <Select
                                value={activity.type}
                                label="Activity Type"
                                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                                startAdornment={
                                    <InputAdornment position="start">
                                        {activity.type === 'RUNNING' && <DirectionsRunIcon color="primary" />}
                                        {activity.type === 'WALKING' && <DirectionsWalkIcon color="primary" />}
                                        {activity.type === 'CYCLING' && <PedalBikeIcon color="primary" />}
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="RUNNING">Running</MenuItem>
                                <MenuItem value="WALKING">Walking</MenuItem>
                                <MenuItem value="CYCLING">Cycling</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Duration"
                            type='number'
                            value={activity.duration}
                            onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TimerIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: <InputAdornment position="end">min</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Calories"
                            type='number'
                            value={activity.caloriesBurned}
                            onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocalFireDepartmentIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button
                            type='submit'
                            variant='contained'
                            size="large"
                            disabled={loading}
                            sx={{ px: 4 }}
                        >
                            {loading ? 'Adding...' : 'Add Activity'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default ActivityForm
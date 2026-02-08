import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, useTheme } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link as RouterLink } from 'react-router-dom';
import { useColorMode } from '../themeContext';

const Navbar = ({ logOut }) => {
    const theme = useTheme();
    const { toggleColorMode, mode } = useColorMode();

    return (
        <AppBar position="sticky" elevation={0} sx={{
            backgroundColor: mode === 'light' ? 'rgba(239, 246, 255, 0.7)' : 'rgba(15, 23, 42, 0.75)', // Subtle blue tint
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid',
            borderColor: mode === 'light' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(96, 165, 250, 0.1)',
            color: 'text.primary',
            zIndex: 1100,
            boxShadow: mode === 'light' ? '0 1px 12px rgba(37, 99, 235, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
                    <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                            FitTrack <span style={{ color: '#2563eb' }}>Pro</span>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button component={RouterLink} to="/activities" variant="text" sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                            Activities
                        </Button>
                        <IconButton onClick={toggleColorMode} color="inherit">
                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <Button onClick={logOut} variant="outlined" color="primary" size="small" sx={{ borderRadius: '10px', ml: 1 }}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;


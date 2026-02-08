import { Box, Button, Typography, Container, Paper, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Navbar from "./components/Navbar";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import heroBg from "./assets/hero-bg.png";

const ActvitiesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          Your Activities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your fitness journey easily.
        </Typography>
      </Box>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </Container>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      // Ensure local storage is in sync for the API service
      localStorage.setItem('token', token);
      if (tokenData?.sub) {
        localStorage.setItem('userId', tokenData.sub);
      }
    }
  }, [token, tokenData, dispatch]);

  const activeTheme = useTheme();
  const isDark = activeTheme.palette.mode === 'dark';

  return (
    <Router>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          position: "relative",
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(240, 244, 248, 0.4)",
            // Removed global blur for clarity as requested
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {!token ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
              }}
            >
              <Container maxWidth="sm">
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, sm: 6 },
                    textAlign: "center",
                    borderRadius: 4,
                    bgcolor: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(16px)", // More blur on the card itself for readability
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "primary.main",
                      color: "white",
                      mb: 3,
                    }}
                  >
                    <FitnessCenterIcon fontSize="large" />
                  </Box>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: "-1px" }}>
                    FitTrack <span style={{ color: "#2563eb" }}>Pro</span>
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                    Welcome to the premium fitness experience. Sign in to access your personalized activity dashboard.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => logIn()}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                    }}
                  >
                    Login with Keycloak
                  </Button>
                </Paper>
              </Container>
            </Box>
          ) : (
            <>
              <Navbar logOut={logOut} />
              <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
                <Routes>
                  <Route path="/activities" element={<ActvitiesPage />} />
                  <Route path="/activities/:id" element={<ActivityDetail />} />
                  <Route path="/" element={<Navigate to="/activities" replace />} />
                </Routes>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Router>
  );
}

export default App;


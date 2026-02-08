import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/material/Grid2',
      '@mui/icons-material/FitnessCenter',
      '@mui/icons-material/DirectionsRun',
      '@mui/icons-material/DirectionsWalk',
      '@mui/icons-material/PedalBike',
      '@mui/icons-material/Timer',
      '@mui/icons-material/LocalFireDepartment',
      '@mui/icons-material/AutoAwesome',
      '@mui/icons-material/ArrowBack',
      '@mui/icons-material/ArrowForwardIos',
      '@mui/icons-material/Brightness4',
      '@mui/icons-material/Brightness7'
    ],
  },
})

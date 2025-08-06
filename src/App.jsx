import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";
import BuySell from "./pages/BuySell";
import Prediction from "./pages/Prediction";
import Forum from "./pages/Forum";
import Navbar from "./components/Navbar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD600', // Mustard yellow
    },
    background: {
      default: '#181818',
      paper: '#232323',
    },
    text: {
      primary: '#f3f3f3',
      secondary: '#FFD600',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
          <Route path="/compare" element={<BuySell />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;

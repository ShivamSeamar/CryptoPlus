import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrendingCoins, fetchMarketData, searchCoins } from "../api/crypto";
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea, TextField, Chip, CircularProgress, Paper } from '@mui/material';

const HERO_BG = 'image.png'; // Crypto/trading themed image

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [market, setMarket] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTrendingCoins(),
      fetchMarketData()
    ])
      .then(([trendingData, marketData]) => {
        setTrending(trendingData);
        setMarket(marketData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle search
  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchCoins(search).then(setSearchResults).catch(() => setSearchResults([]));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || error) return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif', m: 0, p: 0 }}>
      <CircularProgress color="primary" size={60} thickness={5} />
    </Box>
  );

  // Trending sorted by rank ascending
  const trendingSorted = [...trending].sort((a, b) => a.market_cap_rank - b.market_cap_rank);

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', bgcolor: 'background.default', color: '#fff', fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif' }}>
      {/* Hero Section with video background */}
      <Box sx={{
        width: '100%',
        minHeight: { xs: 320, md: 440 },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 0,
        mt: { xs: 8, md: 10 }
      }}>
        {/* Video Background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
          borderRadius: 0
        }}>
          <video
            src={'vid.mp4'}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
          {/* Overlay for readability */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(24,28,37,0.55)',
            zIndex: 1
          }} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: 36, sm: 48, md: 64 },
              letterSpacing: 2,
              textAlign: 'center',
              mb: 2,
              background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 32px rgba(0,225,192,0.18)',
              fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
              lineHeight: 1.1
            }}
          >
            All Your Crypto & Trading Insights in One Place
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: { xs: 18, sm: 24, md: 28 },
              textAlign: 'center',
              mb: 1,
              textShadow: '0 2px 16px rgba(0,225,192,0.10)',
              fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
              letterSpacing: 0.5
            }}
          >
            Real-time prices, trends, and analytics for smarter trading decisions.
          </Typography>
        </Container>
      </Box>
      {/* Search Bar Section */}
      <Container maxWidth={false} sx={{ maxWidth: 900, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>
        <Paper elevation={6} sx={{ display: 'flex', alignItems: 'center', borderRadius: 4, p: 1.5, mb: 2, bgcolor: '#23283a', boxShadow: '0 4px 24px rgba(0,225,192,0.07)' }}>
          <Box sx={{ pl: 1, pr: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="11" stroke="#00e1c0" strokeWidth="2"/><path d="M21 21l-4-4" stroke="#00e1c0" strokeWidth="2" strokeLinecap="round"/></svg>
          </Box>
          <TextField
            fullWidth
            variant="standard"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for a cryptocurrency by name or symbol..."
            InputProps={{
              disableUnderline: true,
              sx: {
                color: '#fff',
                fontWeight: 500,
                fontSize: 20,
                fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
                bgcolor: 'transparent',
                borderRadius: 2,
                px: 1,
              }
            }}
            inputProps={{
              style: {
                padding: '10px 0',
              }
            }}
          />
        </Paper>
        {searchResults.length > 0 && (
          <Paper sx={{ mt: -1, bgcolor: '#23283a', borderRadius: 3, boxShadow: 8, maxHeight: 240, overflowY: 'auto', position: 'relative', zIndex: 10, border: '1px solid #2e3448' }}>
            {searchResults.map((coin) => (
              <Box
                key={coin.id}
                sx={{
                  p: 2,
                  borderBottom: '1px solid #2e3448',
                  cursor: 'pointer',
                  color: '#fff',
                  fontWeight: 500,
                  fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: 'primary.main', color: '#181818' }
                }}
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <img src={coin.thumb || coin.large} alt={coin.name} width={28} height={28} style={{ borderRadius: 8, background: '#fff', marginRight: 12 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600, color: 'inherit', fontSize: 18 }}>{coin.name}</Typography>
                  <Typography sx={{ color: '#b0b0b0', fontSize: 14 }}>{coin.symbol.toUpperCase()}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        )}
      </Container>
      {/* Trending Currencies Section */}
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: 6 }}>
        <Paper elevation={0} sx={{
          bgcolor: 'transparent',
          background: 'linear-gradient(90deg, #181c25 60%, #23283a 100%)',
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          mb: 4,
        }}>
          <Box sx={{ mb: 4, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                letterSpacing: 1,
                fontSize: { xs: 28, md: 38 },
                background: 'linear-gradient(90deg, #00e1c0 30%, #00b8a9 70%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 16px rgba(0,225,192,0.10)',
                animation: 'fadeIn 1s',
                mb: 1
              }}
            >
              Trending Cryptocurrencies
            </Typography>
            <Box sx={{ width: 80, height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #00e1c0 30%, #00b8a9 70%)', boxShadow: '0 2px 8px rgba(0,225,192,0.10)' }} />
          </Box>
          <Grid container spacing={4} mb={2} alignItems="stretch" justifyContent="center">
            {trendingSorted.map((coin, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={coin.id} display="flex" justifyContent="center">
                <Card
                  sx={{
                    bgcolor: '#20243a',
                    borderRadius: 4,
                    boxShadow: 6,
                    width: 270,
                    height: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    animation: 'fadeIn 0.7s',
                    '&:hover': {
                      transform: 'scale(1.045)',
                      boxShadow: '0 8px 32px rgba(0,225,192,0.18)',
                      border: '1.5px solid #00e1c0',
                    },
                    mt: idx < 4 ? 0 : 2
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/coin/${coin.id}`)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, width: '100%' }}>
                      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                        <img src={coin.large} alt={coin.name} width={64} height={64} style={{ borderRadius: 16, background: '#fff', padding: 8, boxShadow: '0 2px 8px rgba(0,225,192,0.10)' }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', textAlign: 'center', fontSize: 20, mb: 0.5 }}>
                        {coin.name} <span style={{ color: '#00e1c0' }}>({coin.symbol.toUpperCase()})</span>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, mt: 1, textAlign: 'center', fontSize: 16 }}>
                        Rank #{coin.market_cap_rank}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 
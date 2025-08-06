import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMarketDataForPrediction, fetchCoinHistoricalData } from "../api/crypto";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button
} from "@mui/material";

const Prediction = () => {
  const [marketData, setMarketData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinHistory, setCoinHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchMarketDataForPrediction()
      .then(data => {
        setMarketData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const analyzeTrend = (coin) => {
    setAnalyzing(true);
    setSelectedCoin(coin);
    
    fetchCoinHistoricalData(coin.id, 30)
      .then(data => {
        // Format data for chart
        const chartData = data.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price: price
        }));
        setCoinHistory(chartData);
        setAnalyzing(false);
      })
      .catch(() => {
        setCoinHistory([]);
        setAnalyzing(false);
      });
  };

  const calculatePrediction = (coin) => {
    const { price_change_percentage_1h_in_currency, price_change_percentage_24h_in_currency, price_change_percentage_7d_in_currency, price_change_percentage_30d_in_currency } = coin;
    
    // Trend analysis based on multiple timeframes
    const shortTerm = price_change_percentage_1h_in_currency || 0;
    const mediumTerm = price_change_percentage_24h_in_currency || 0;
    const longTerm = price_change_percentage_7d_in_currency || 0;
    const veryLongTerm = price_change_percentage_30d_in_currency || 0;
    
    // Weighted scoring system
    const score = (shortTerm * 0.1) + (mediumTerm * 0.3) + (longTerm * 0.4) + (veryLongTerm * 0.2);
    
    // Determine prediction
    let prediction = 'NEUTRAL';
    let confidence = 50;
    let signal = 'HOLD';
    
    if (score > 5) {
      prediction = 'BULLISH';
      confidence = Math.min(90, 50 + Math.abs(score));
      signal = 'BUY';
    } else if (score < -5) {
      prediction = 'BEARISH';
      confidence = Math.min(90, 50 + Math.abs(score));
      signal = 'SELL';
    } else {
      confidence = 50 - Math.abs(score);
    }
    
    // Additional factors
    const volumeFactor = coin.total_volume > 1000000000 ? 10 : 0; // High volume bonus
    const marketCapFactor = coin.market_cap > 10000000000 ? 5 : 0; // Large cap bonus
    
    confidence = Math.min(95, confidence + volumeFactor + marketCapFactor);
    
    return { prediction, confidence, signal, score };
  };

  const getPredictionColor = (prediction) => {
    switch (prediction) {
      case 'BULLISH': return '#00e1c0';
      case 'BEARISH': return '#ff4d4f';
      default: return '#b0b0b0';
    }
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'BUY': return '#00e1c0';
      case 'SELL': return '#ff4d4f';
      default: return '#b0b0b0';
    }
  };

  if (loading) return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#23283a', m: 0, p: 0 }}>
      <CircularProgress color="primary" size={60} thickness={5} />
    </Box>
  );
  if (error) return <Box sx={{ p: 3, minHeight: '100vh', bgcolor: '#23283a', color: '#ff4d4f' }}>Error: {error}</Box>;

  // Sort coins by prediction strength
  const analyzedCoins = marketData.map(coin => ({
    ...coin,
    analysis: calculatePrediction(coin)
  })).sort((a, b) => Math.abs(b.analysis.score) - Math.abs(a.analysis.score));

  const bullishCoins = analyzedCoins.filter(coin => coin.analysis.prediction === 'BULLISH').slice(0, 10);
  const bearishCoins = analyzedCoins.filter(coin => coin.analysis.prediction === 'BEARISH').slice(0, 10);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'linear-gradient(135deg, #181c25 0%, #23283a 100%)', color: '#f3f3f3', fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif', mb: { xs: 12, md: 14 } }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'rgba(24,28,37,0.85)', py: 4, borderBottom: '1px solid #00e1c0', width: '100%', mt: { xs: 8, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 } }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1, textAlign: 'center', fontSize: { xs: 32, md: 44 }, textShadow: '0 4px 32px rgba(0,225,192,0.18)' }}>AI Price Predictions</Typography>
          <Typography variant="h6" sx={{ color: '#b0b0b0', fontWeight: 500, textAlign: 'center', fontSize: { xs: 16, md: 20 } }}>
            Advanced trend analysis using historical data and market indicators
          </Typography>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>
        {/* Disclaimer */}
        <Alert severity="warning" sx={{ mb: 4, bgcolor: 'rgba(255,77,79,0.10)', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: 3, fontWeight: 600 }}>
          These predictions are based on historical data analysis and technical indicators. They are for educational purposes only and should not be considered as financial advice. Always do your own research and never invest more than you can afford to lose.
        </Alert>

        {/* Bullish Predictions */}
        <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>🚀 Bullish Predictions (Potential Gains)</Typography>
          <Grid container spacing={3}>
            {bullishCoins.map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Paper
                  onClick={() => analyzeTrend(coin)}
                  sx={{
                    bgcolor: '#23283a',
                    borderRadius: 3,
                    p: 3,
                    border: '1.5px solid #00e1c0',
                    cursor: 'pointer',
                    boxShadow: '0 2px 16px #00e1c040',
                    transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 32px #00e1c060',
                      border: '1.5px solid #FFD600',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img src={coin.image} alt={coin.name} width={32} height={32} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{coin.name}</Typography>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14 }}>{coin.symbol.toUpperCase()}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ bgcolor: '#00e1c0', color: '#181c25', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px #00e1c040' }}>{coin.analysis.signal}</Box>
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography sx={{ color: '#b0b0b0', fontSize: 13 }}>Current Price</Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>${coin.current_price.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: '#b0b0b0', fontSize: 13 }}>Confidence</Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#00e1c0' }}>{coin.analysis.confidence.toFixed(0)}%</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ bgcolor: '#181c25', borderRadius: 2, p: 2, fontSize: 14 }}>
                    <Typography sx={{ color: '#b0b0b0', mb: 0.5 }}>Trend Score: {coin.analysis.score.toFixed(2)}</Typography>
                    <Typography sx={{ color: '#00e1c0' }}>24h: {coin.price_change_percentage_24h_in_currency?.toFixed(2)}% | 7d: {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Bearish Predictions */}
        <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: 'transparent', background: 'linear-gradient(90deg, #ff4d4f 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>📉 Bearish Predictions (Potential Declines)</Typography>
          <Grid container spacing={3}>
            {bearishCoins.map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Paper
                  onClick={() => analyzeTrend(coin)}
                  sx={{
                    bgcolor: '#23283a',
                    borderRadius: 3,
                    p: 3,
                    border: '1.5px solid #ff4d4f',
                    cursor: 'pointer',
                    boxShadow: '0 2px 16px #ff4d4f40',
                    transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 32px #ff4d4f60',
                      border: '1.5px solid #FFD600',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img src={coin.image} alt={coin.name} width={32} height={32} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{coin.name}</Typography>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14 }}>{coin.symbol.toUpperCase()}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ bgcolor: '#ff4d4f', color: '#fff', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px #ff4d4f40' }}>{coin.analysis.signal}</Box>
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography sx={{ color: '#b0b0b0', fontSize: 13 }}>Current Price</Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>${coin.current_price.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ color: '#b0b0b0', fontSize: 13 }}>Confidence</Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#ff4d4f' }}>{coin.analysis.confidence.toFixed(0)}%</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ bgcolor: '#181c25', borderRadius: 2, p: 2, fontSize: 14 }}>
                    <Typography sx={{ color: '#b0b0b0', mb: 0.5 }}>Trend Score: {coin.analysis.score.toFixed(2)}</Typography>
                    <Typography sx={{ color: '#ff4d4f' }}>24h: {coin.price_change_percentage_24h_in_currency?.toFixed(2)}% | 7d: {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Detailed Analysis Section */}
        {selectedCoin && (
          <Paper sx={{ bgcolor: 'rgba(24,28,37,0.95)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <img src={selectedCoin.image} alt={selectedCoin.name} width={48} height={48} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedCoin.name} <Box component="span" sx={{ color: '#00e1c0' }}>({selectedCoin.symbol.toUpperCase()})</Box></Typography>
                <Typography sx={{ color: '#b0b0b0' }}>Detailed Trend Analysis</Typography>
              </Box>
            </Box>
            {analyzing ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress color="primary" size={40} />
                <Typography sx={{ mt: 2, color: '#fff', fontWeight: 400 }}>Analyzing historical data...</Typography>
              </Box>
            ) : (
              <>
                {/* Prediction Summary */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#b0b0b0', mb: 1 }}>Prediction</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: getPredictionColor(selectedCoin.analysis.prediction) }}>{selectedCoin.analysis.prediction}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#b0b0b0', mb: 1 }}>Confidence</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#00e1c0' }}>{selectedCoin.analysis.confidence.toFixed(0)}%</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#b0b0b0', mb: 1 }}>Signal</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: getSignalColor(selectedCoin.analysis.signal) }}>{selectedCoin.analysis.signal}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#b0b0b0', mb: 1 }}>Trend Score</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: selectedCoin.analysis.score > 0 ? '#00e1c0' : '#ff4d4f' }}>{selectedCoin.analysis.score.toFixed(2)}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                {/* Price Chart */}
                {coinHistory.length > 0 && (
                  <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>30-Day Price Trend</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={coinHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2e3448" />
                        <XAxis dataKey="time" tick={{ fill: '#b0b0b0', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} domain={['auto', 'auto']} width={80} />
                        <Tooltip contentStyle={{ background: '#181c25', border: 'none', color: '#00e1c0' }} labelStyle={{ color: '#00e1c0' }} />
                        <Line type="monotone" dataKey="price" stroke="#00e1c0" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                )}
                {/* Analysis Factors */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Analysis Factors</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 2 }}>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 1 }}>1 Hour Change</Typography>
                        <Typography sx={{ fontSize: 16, color: selectedCoin.price_change_percentage_1h_in_currency > 0 ? '#00e1c0' : '#ff4d4f' }}>{selectedCoin.price_change_percentage_1h_in_currency?.toFixed(2)}%</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 2 }}>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 1 }}>24 Hour Change</Typography>
                        <Typography sx={{ fontSize: 16, color: selectedCoin.price_change_percentage_24h_in_currency > 0 ? '#00e1c0' : '#ff4d4f' }}>{selectedCoin.price_change_percentage_24h_in_currency?.toFixed(2)}%</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 2 }}>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 1 }}>7 Day Change</Typography>
                        <Typography sx={{ fontSize: 16, color: selectedCoin.price_change_percentage_7d_in_currency > 0 ? '#00e1c0' : '#ff4d4f' }}>{selectedCoin.price_change_percentage_7d_in_currency?.toFixed(2)}%</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ bgcolor: '#23283a', borderRadius: 2, p: 2 }}>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 1 }}>30 Day Change</Typography>
                        <Typography sx={{ fontSize: 16, color: selectedCoin.price_change_percentage_30d_in_currency > 0 ? '#00e1c0' : '#ff4d4f' }}>{selectedCoin.price_change_percentage_30d_in_currency?.toFixed(2)}%</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Paper>
        )}

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4, color: "#b0b0b0", borderTop: '1px solid #2e3448' }}>
          <Typography sx={{ fontWeight: 400 }}>
            Predictions are based on historical data analysis and technical indicators.
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, mt: 1 }}>Click on any coin to see detailed trend analysis and 30-day price chart.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Prediction; 
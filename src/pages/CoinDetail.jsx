import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCoinDetail, fetchCoinMarketChart, fetchCoinTickers } from "../api/crypto";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Container, Box, Paper, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const chartRanges = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "1M", value: 30 },
];

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [chart, setChart] = useState([]);
  const [range, setRange] = useState(1);
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCoinDetail(id),
      fetchCoinTickers(id)
    ])
      .then(([coinData, tickersData]) => {
        setCoin(coinData);
        setTickers(tickersData.filter(t => t.target === "USD" && t.last));
        setLoading(false);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setChartLoading(true);
    fetchCoinMarketChart(id, range)
      .then((data) => {
        // Format for recharts: [{ time, price }]
        setChart(
          data.prices.map(([timestamp, price]) => ({
            time: new Date(timestamp).toLocaleDateString("en-US", range === 1 ? { hour: "2-digit", minute: "2-digit" } : { month: "short", day: "numeric" }),
            price,
          }))
        );
      })
      .catch(() => setChart([]))
      .finally(() => setChartLoading(false));
  }, [id, range]);

  if (loading) return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', m: 0, p: 0 }}>
      <CircularProgress color="primary" size={60} thickness={5} />
    </Box>
  );
  if (error || !coin) return <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>Error: {error || "Coin not found"}</Box>;

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'linear-gradient(135deg, #0a2342 0%, #122e4c 100%)', color: '#e3f0ff', mt: { xs: 8, md: 10 } }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', py: 4, px: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 2px 16px #3fa7ff20', width: '100%', mt: { xs: 8, md: 10 }, mb: 4 }}>
        <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 } }}>
          <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
            <Box sx={{ boxShadow: '0 4px 24px #3fa7ff30', borderRadius: '50%', bgcolor: '#122e4c', p: 1 }}>
              <img src={coin.image?.large || coin.image?.small} alt={coin.name} width={80} height={80} style={{ borderRadius: '50%' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ m: 0, fontWeight: 800, color: 'transparent', background: 'linear-gradient(90deg, #3fa7ff 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1, fontSize: { xs: 28, md: 40 }, textShadow: '0 4px 32px #3fa7ff30' }}>{coin.name} <Box component="span" sx={{ color: '#7ecbff' }}>({coin.symbol?.toUpperCase()})</Box></Typography>
              <Typography variant="h4" sx={{ mt: 1, color: '#e3f0ff', fontWeight: 700, fontSize: { xs: 22, md: 32 } }}>
                ${coin.market_data.current_price.usd?.toLocaleString()} &nbsp;
                <Chip
                  label={(coin.market_data.price_change_percentage_24h >= 0 ? '+' : '') + coin.market_data.price_change_percentage_24h?.toFixed(2) + '%'}
                  sx={{
                    bgcolor: coin.market_data.price_change_percentage_24h >= 0 ? '#3fa7ff' : '#ff4d4f',
                    color: coin.market_data.price_change_percentage_24h >= 0 ? '#0a2342' : '#fff',
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                />
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap" mt={3}>
            <Button variant="contained" size="large" onClick={() => navigate(`/compare`)} sx={{ fontWeight: 700, bgcolor: 'linear-gradient(90deg, #3fa7ff 60%, #FFD600 100%)', color: '#181818', borderRadius: 2, px: 4, fontSize: 18, boxShadow: 'none', '&:hover': { bgcolor: 'linear-gradient(90deg, #FFD600 60%, #3fa7ff 100%)', color: '#181818' } }}>
              Buy/Sell
            </Button>
            <Button variant="outlined" size="large" href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 700, borderColor: '#3fa7ff', color: '#3fa7ff', borderRadius: 2, px: 4, fontSize: 18, '&:hover': { borderColor: '#FFD600', color: '#FFD600', bgcolor: 'rgba(63,167,255,0.08)' } }}>
              Official Site
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>
        {/* Chart Section */}
        <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', borderRadius: 4, p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'transparent', background: 'linear-gradient(90deg, #3fa7ff 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>Price Chart</Typography>
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            {chartRanges.map(r => (
              <Button
                key={r.value}
                variant={range === r.value ? 'contained' : 'outlined'}
                onClick={() => setRange(r.value)}
                sx={{
                  fontWeight: 700,
                  bgcolor: range === r.value ? 'linear-gradient(90deg, #3fa7ff 60%, #FFD600 100%)' : 'transparent',
                  color: range === r.value ? '#181818' : '#3fa7ff',
                  borderColor: '#3fa7ff',
                  borderRadius: 2,
                  px: 3,
                  fontSize: 16,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: 'linear-gradient(90deg, #FFD600 60%, #3fa7ff 100%)',
                    color: '#181818',
                  },
                }}
              >
                {r.label}
              </Button>
            ))}
          </Box>
          {chartLoading ? (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3fa7ff' }}>Loading chart...</Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a355c" />
                <XAxis dataKey="time" tick={{ fill: '#7ecbff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#7ecbff', fontSize: 12 }} domain={['auto', 'auto']} width={80} />
                <Tooltip contentStyle={{ background: '#0a2342', border: 'none', color: '#3fa7ff' }} labelStyle={{ color: '#3fa7ff' }} />
                <Line type="monotone" dataKey="price" stroke="#3fa7ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', borderRadius: 3, p: 3, textAlign: 'center', color: '#7ecbff', border: '1.5px solid #3fa7ff' }}>
              <Typography variant="subtitle2" sx={{ color: '#7ecbff', mb: 1 }}>24h High</Typography>
              <Typography variant="h6" sx={{ color: '#3fa7ff' }}>${coin.market_data.high_24h.usd?.toLocaleString()}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', borderRadius: 3, p: 3, textAlign: 'center', color: '#7ecbff', border: '1.5px solid #ff4d4f' }}>
              <Typography variant="subtitle2" sx={{ color: '#7ecbff', mb: 1 }}>24h Low</Typography>
              <Typography variant="h6" sx={{ color: '#ff4d4f' }}>${coin.market_data.low_24h.usd?.toLocaleString()}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', borderRadius: 3, p: 3, textAlign: 'center', color: '#7ecbff', border: '1.5px solid #FFD600' }}>
              <Typography variant="subtitle2" sx={{ color: '#7ecbff', mb: 1 }}>Volume (24h)</Typography>
              <Typography variant="h6" sx={{ color: '#FFD600' }}>${coin.market_data.total_volume.usd?.toLocaleString()}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', borderRadius: 3, p: 3, textAlign: 'center', color: '#7ecbff', border: '1.5px solid #3fa7ff' }}>
              <Typography variant="subtitle2" sx={{ color: '#7ecbff', mb: 1 }}>Market Cap</Typography>
              <Typography variant="h6" sx={{ color: '#3fa7ff' }}>${coin.market_data.market_cap.usd?.toLocaleString()}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Exchange Prices Section */}
        <Paper elevation={0} sx={{ bgcolor: 'rgba(10,35,66,0.85)', borderRadius: 4, p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#3fa7ff', mb: 3, fontWeight: 700 }}>Prices on Major Exchanges</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#122e4c' }}>
                  <TableCell sx={{ color: '#3fa7ff', fontWeight: 700 }}>Exchange</TableCell>
                  <TableCell sx={{ color: '#3fa7ff', fontWeight: 700 }}>Pair</TableCell>
                  <TableCell sx={{ color: '#3fa7ff', fontWeight: 700 }}>Price (USD)</TableCell>
                  <TableCell sx={{ color: '#3fa7ff', fontWeight: 700 }}>Trade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickers.length === 0 && (
                  <TableRow><TableCell colSpan={4} sx={{ color: '#7ecbff', textAlign: 'center', py: 3 }}>No exchange data available.</TableCell></TableRow>
                )}
                {tickers.slice(0, 15).map((t, i) => (
                  <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(63,167,255,0.07)' } }}>
                    <TableCell>{t.market.name}</TableCell>
                    <TableCell>{t.base}/{t.target}</TableCell>
                    <TableCell sx={{ color: '#3fa7ff', fontWeight: 700 }}>${t.last.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button href={t.trade_url} target="_blank" rel="noopener noreferrer" variant="outlined" size="small" sx={{ fontWeight: 700, borderColor: '#3fa7ff', color: '#3fa7ff', borderRadius: 2, px: 2, fontSize: 15, '&:hover': { borderColor: '#FFD600', color: '#FFD600', bgcolor: 'rgba(63,167,255,0.08)' } }}>
                        Trade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4, color: '#7ecbff', borderTop: '1px solid #1a355c', fontSize: 15, letterSpacing: 1 }}>
          Powered by CoinGecko API
        </Box>
      </Container>
    </Box>
  );
};

export default CoinDetail; 
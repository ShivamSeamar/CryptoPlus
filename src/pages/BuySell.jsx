import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCoins, fetchCoinTickers } from "../api/crypto";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Modal, 
  Paper, 
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BuySell = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedAction, setSelectedAction] = useState({ type: '', exchange: '', url: '' });
  const navigate = useNavigate();

  // Handle coin search
  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const results = await searchCoins(e.target.value);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  };

  // Handle coin selection
  const handleSelectCoin = async (coin) => {
    setSelectedCoin(coin);
    setSearchResults([]);
    setQuery(coin.name);
    setLoading(true);
    setError(null);
    try {
      const tickersData = await fetchCoinTickers(coin.id);
      setTickers(tickersData);
    } catch (err) {
      setError("Failed to fetch prices from exchanges.");
      setTickers([]);
    }
    setLoading(false);
  };

  // Handle login modal open
  const handleLoginClick = (type, exchange, url) => {
    setSelectedAction({ type, exchange, url });
    setLoginModalOpen(true);
    setLoginError('');
    setLoginData({ email: '', password: '' });
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // Simulate login process
    setTimeout(() => {
      setLoginLoading(false);
      if (loginData.email && loginData.password) {
        // Success - redirect to exchange
        window.open(selectedAction.url, '_blank');
        setLoginModalOpen(false);
      } else {
        setLoginError('Please enter both email and password');
      }
    }, 1500);
  };

  // Buy: ascending price, Sell: descending price
  const buyPrices = [...tickers]
    .filter(t => t.target === "USD" && t.last)
    .sort((a, b) => a.last - b.last);
  const sellPrices = [...tickers]
    .filter(t => t.target === "USD" && t.last)
    .sort((a, b) => b.last - a.last);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'linear-gradient(135deg, #181c25 0%, #23283a 100%)', color: '#f3f3f3', fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif', mt: { xs: 8, md: 10 } }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'rgba(24,28,37,0.85)', py: 4, borderBottom: '1px solid #00e1c0', width: '100%' }}>
        <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 } }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1, textAlign: 'center', fontSize: { xs: 32, md: 44 }, textShadow: '0 4px 32px rgba(0,225,192,0.18)' }}>Buy/Sell Comparison</Typography>
          <Typography variant="h6" sx={{ color: '#b0b0b0', fontWeight: 500, textAlign: 'center', fontSize: { xs: 16, md: 20 } }}>
            Compare cryptocurrency prices across multiple exchanges to find the best deals
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>
        {/* Search Section */}
        <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>Search for a Cryptocurrency</Typography>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              variant="outlined"
              value={query}
              onChange={handleSearch}
              placeholder="Search by name or symbol (e.g., Bitcoin, BTC)..."
              sx={{
                input: { color: '#f3f3f3', fontWeight: 500, fontSize: 18 },
                bgcolor: '#23283a',
                borderRadius: 2,
                boxShadow: '0 2px 8px #00e1c040',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#00e1c0' },
                  '&:hover fieldset': { borderColor: '#FFD600' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD600' }
                }
              }}
            />
            {searchResults.length > 0 && (
              <Paper sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                bgcolor: '#23283a',
                borderRadius: 2,
                boxShadow: 8,
                maxHeight: 300,
                overflowY: 'auto',
                zIndex: 1000,
                border: '1px solid #00e1c0',
                mt: 1
              }}>
                {searchResults.map((coin) => (
                  <Box
                    key={coin.id}
                    sx={{
                      cursor: "pointer",
                      p: 2,
                      borderBottom: '1px solid #2e3448',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'background 0.15s',
                      '&:hover': { bgcolor: '#181c25', color: '#00e1c0' }
                    }}
                    onClick={() => handleSelectCoin(coin)}
                  >
                    <img src={coin.thumb} alt={coin.name} width={24} height={24} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#00e1c0' }}>{coin.name}</Typography>
                      <Typography sx={{ color: '#FFD600', fontSize: 14 }}>{coin.symbol.toUpperCase()}</Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </Paper>

        {selectedCoin && (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, width: '100%', bgcolor: '#181c25', borderRadius: 3, p: 0, m: 0 }}>
                <CircularProgress color="primary" size={40} />
                <Typography sx={{ mt: 2, color: '#fff', fontWeight: 400 }}>Loading exchange prices...</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ textAlign: 'center', p: 6, bgcolor: '#181c25', borderRadius: 3 }}>
                <Typography sx={{ color: '#ff4d4f', fontWeight: 400 }}>{error}</Typography>
              </Box>
            ) : (
              <>
                {/* Buy Prices Section */}
                <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>Best Buy Prices (Lowest to Highest)</Typography>
                  {buyPrices.length === 0 ? (
                    <Box sx={{ textAlign: 'center', p: 4, color: '#b0b0b0' }}>
                      <Typography sx={{ fontWeight: 400 }}>No buy prices available</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      {buyPrices.slice(0, 6).map((ticker, index) => (
                        <Paper key={index} sx={{ 
                          bgcolor: 'rgba(24,28,37,0.85)',
                          borderRadius: 3,
                          p: 3,
                          border: index === 0 ? '2px solid #00e1c0' : '1px solid #23283a',
                          boxShadow: index === 0 ? '0 4px 24px #00e1c040' : '0 2px 8px #00e1c020',
                          transition: 'transform 0.18s, box-shadow 0.18s',
                          '&:hover': { transform: 'scale(1.03)', boxShadow: '0 8px 32px #00e1c060' }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#00e1c0' }}>{ticker.market.name}</Typography>
                            {index === 0 && (
                              <Box sx={{ bgcolor: 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)', color: '#181818', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px #00e1c040' }}>
                                BEST PRICE
                              </Box>
                            )}
                          </Box>
                          <Typography sx={{ fontSize: 26, color: '#FFD600', fontWeight: 800, mb: 1, letterSpacing: 1 }}>
                            ${ticker.last.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: '#00e1c0', mb: 3, fontWeight: 500 }}>
                            Pair: {ticker.base}/{ticker.target}
                          </Typography>
                          <Button 
                            fullWidth
                            variant="contained"
                            onClick={() => handleLoginClick('buy', ticker.market.name, ticker.trade_url)}
                            sx={{ 
                              bgcolor: 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)',
                              color: '#181818',
                              fontWeight: 700,
                              fontSize: 17,
                              borderRadius: 2,
                              boxShadow: '0 2px 8px #00e1c040',
                              letterSpacing: 1,
                              transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                              '&:hover': { bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)', transform: 'scale(1.04)', boxShadow: '0 4px 16px #00e1c060' },
                              '&:disabled': { bgcolor: '#23283a', color: '#00e1c0' }
                            }}
                          >
                            Buy on {ticker.market.name}
                          </Button>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Paper>

                {/* Selected Coin Info */}
                <Paper sx={{ bgcolor: 'rgba(24,28,37,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(6px)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <img src={selectedCoin.thumb} alt={selectedCoin.name} width={48} height={48} />
                    <Box>
                      <Typography variant="h4" sx={{ color: '#FFD600', fontWeight: 700 }}>
                        {selectedCoin.name} <span style={{ color: '#00e1c0' }}>({selectedCoin.symbol.toUpperCase()})</span>
                      </Typography>
                      <Typography sx={{ color: '#b0b0b0', fontWeight: 500 }}>
                        Market Cap Rank: #{selectedCoin.market_cap_rank}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Sell Prices Section */}
                <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'transparent', background: 'linear-gradient(90deg, #ff4d4f 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>Best Sell Prices (Highest to Lowest)</Typography>
                  {sellPrices.length === 0 ? (
                    <Box sx={{ textAlign: 'center', p: 4, color: '#b0b0b0' }}>
                      <Typography sx={{ fontWeight: 400 }}>No sell prices available</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                      {sellPrices.slice(0, 6).map((ticker, index) => (
                        <Paper key={index} sx={{ 
                          bgcolor: 'rgba(24,28,37,0.85)',
                          borderRadius: 3,
                          p: 3,
                          border: index === 0 ? '2px solid #ff4d4f' : '1px solid #FFD600',
                          boxShadow: index === 0 ? '0 4px 24px #ff4d4f40' : '0 2px 8px #ff4d4f20',
                          transition: 'transform 0.18s, box-shadow 0.18s',
                          '&:hover': { transform: 'scale(1.03)', boxShadow: '0 8px 32px #ff4d4f60' }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#ff4d4f' }}>{ticker.market.name}</Typography>
                            {index === 0 && (
                              <Box sx={{ bgcolor: 'linear-gradient(90deg, #ff4d4f 60%, #FFD600 100%)', color: '#181818', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px #ff4d4f40' }}>
                                BEST PRICE
                              </Box>
                            )}
                          </Box>
                          <Typography sx={{ fontSize: 26, color: '#FFD600', fontWeight: 800, mb: 1, letterSpacing: 1 }}>
                            ${ticker.last.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: '#ff4d4f', mb: 3, fontWeight: 500 }}>
                            Pair: {ticker.base}/{ticker.target}
                          </Typography>
                          <Button 
                            fullWidth
                            variant="contained"
                            onClick={() => handleLoginClick('sell', ticker.market.name, ticker.trade_url)}
                            sx={{ 
                              bgcolor: 'linear-gradient(90deg, #ff4d4f 60%, #FFD600 100%)',
                              color: '#181818',
                              fontWeight: 700,
                              fontSize: 17,
                              borderRadius: 2,
                              boxShadow: '0 2px 8px #ff4d4f40',
                              letterSpacing: 1,
                              transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                              '&:hover': { bgcolor: 'linear-gradient(90deg, #FFD600 60%, #ff4d4f 100%)', transform: 'scale(1.04)', boxShadow: '0 4px 16px #ff4d4f60' },
                              '&:disabled': { bgcolor: '#23283a', color: '#ff4d4f' }
                            }}
                          >
                            Sell on {ticker.market.name}
                          </Button>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Paper>

                {/* All Exchange Prices Table */}
                <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4, backdropFilter: 'blur(8px)' }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>All Exchange Prices</Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                      <Box component="thead">
                        <Box component="tr" sx={{ color: '#00e1c0', fontWeight: 600, borderBottom: '2px solid #2e3448' }}>
                          <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Exchange</Box>
                          <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Pair</Box>
                          <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Price (USD)</Box>
                          <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Volume</Box>
                          <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Action</Box>
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {tickers.slice(0, 20).map((t, i) => (
                          <Box component="tr" key={i} sx={{ borderBottom: '1px solid #2e3448' }}>
                            <Box component="td" sx={{ p: 2 }}>{t.market.name}</Box>
                            <Box component="td" sx={{ p: 2 }}>{t.base}/{t.target}</Box>
                            <Box component="td" sx={{ p: 2, color: '#FFD600', fontWeight: 600 }}>${t.last.toLocaleString()}</Box>
                            <Box component="td" sx={{ p: 2, color: '#b0b0b0' }}>
                              {t.converted_volume?.usd ? `$${t.converted_volume.usd.toLocaleString()}` : 'N/A'}
                            </Box>
                            <Box component="td" sx={{ p: 2 }}>
                              <Button 
                                variant="text" 
                                onClick={() => handleLoginClick('trade', t.market.name, t.trade_url)}
                                sx={{ color: '#00e1c0', fontWeight: 600, textTransform: 'none' }}
                              >
                                Trade
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </>
            )}
          </>
        )}
      </Container>

      {/* Login Modal */}
      <Modal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Paper sx={{
          bgcolor: 'rgba(24,28,37,0.95)',
          borderRadius: 4,
          p: 4,
          maxWidth: 400,
          width: '100%',
          position: 'relative',
          border: '1.5px solid #00e1c0',
          boxShadow: '0 4px 32px #00e1c040',
          backdropFilter: 'blur(8px)'
        }}>
          <IconButton
            onClick={() => setLoginModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#b0b0b0'
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" sx={{ color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
            Login Required
          </Typography>
          <Typography sx={{ color: '#b0b0b0', mb: 3, textAlign: 'center', fontWeight: 500 }}>
            Please login to {selectedAction.type} on {selectedAction.exchange}
          </Typography>

          <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
            {loginError && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#ff4d4f' }}>
                {loginError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { 
                  color: '#f3f3f3',
                  bgcolor: '#23283a',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#00e1c0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD600' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD600' }
                }
              }}
              InputLabelProps={{
                sx: { color: '#b0b0b0' }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { 
                  color: '#f3f3f3',
                  bgcolor: '#23283a',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#00e1c0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD600' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD600' }
                }
              }}
              InputLabelProps={{
                sx: { color: '#b0b0b0' }
              }}
            />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loginLoading}
              sx={{
                bgcolor: 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)',
                color: '#181818',
                fontWeight: 700,
                py: 1.5,
                fontSize: 17,
                borderRadius: 2,
                boxShadow: '0 2px 8px #00e1c040',
                letterSpacing: 1,
                transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                '&:hover': { bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)', transform: 'scale(1.04)', boxShadow: '0 4px 16px #00e1c060' },
                '&:disabled': { bgcolor: '#23283a', color: '#00e1c0' }
              }}
            >
              {loginLoading ? <CircularProgress size={24} color="inherit" /> : 'Login & Continue'}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default BuySell; 
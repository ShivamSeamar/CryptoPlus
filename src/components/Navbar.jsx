import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Buy/Sell', path: '/compare' },
  { label: 'Prediction', path: '/predict' },
  { label: 'Forum', path: '/forum' },
];

const currencies = [
  { label: 'INR', value: 'INR' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currency, setCurrency] = React.useState('INR');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loginData, setLoginData] = React.useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCurrencyChange = (cur) => {
    setCurrency(cur);
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };
  const handleLoginOpen = () => {
    setLoginOpen(true);
    setLoginError('');
    setLoginData({ email: '', password: '' });
  };
  const handleLoginClose = () => {
    setLoginOpen(false);
    setLoginError('');
    setLoginData({ email: '', password: '' });
  };
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginData.email || !loginData.password) {
      setLoginError('Please enter both email and password');
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setLoginOpen(false);
      // Simulate login success (replace with real auth logic)
    }, 1500);
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{
      bgcolor: 'rgba(24,28,37,0.75)',
      backdropFilter: 'blur(12px)',
      borderRadius: 0,
      boxShadow: '0 4px 24px rgba(0,225,192,0.10)',
      width: '100%',
      left: 0,
      top: 0,
      border: 'none',
      transition: 'background 0.3s',
      zIndex: 1200,
      px: 0,
    }}>
      <Toolbar sx={{ maxWidth: 1400, mx: 'auto', width: '100%', minHeight: 64 }}>
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            fontWeight: 900,
            letterSpacing: 1,
            background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 16px rgba(0,225,192,0.10)',
            fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          CryptoPulse
        </Typography>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              component={NavLink}
              to={page.path}
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                px: 2.5,
                py: 1.2,
                borderRadius: 2,
                letterSpacing: 0.5,
                position: 'relative',
                overflow: 'hidden',
                transition: 'color 0.18s, background 0.18s',
                '&.active': {
                  color: '#00e1c0',
                  background: 'rgba(0,225,192,0.08)',
                },
                '&:hover': {
                  color: '#FFD600',
                  background: 'rgba(0,225,192,0.10)',
                },
              }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
          <Button
            onClick={handleMenu}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              color: '#fff',
              border: '1.5px solid #00e1c0',
              fontWeight: 700,
              px: 2.5,
              borderRadius: 2,
              background: 'rgba(0,225,192,0.07)',
              transition: 'border 0.18s, background 0.18s',
              fontSize: 16,
              '&:hover': {
                border: '1.5px solid #FFD600',
                background: 'rgba(255,214,0,0.10)',
                color: '#FFD600',
              },
            }}
          >
            {currency}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {currencies.map((cur) => (
              <MenuItem key={cur.value} onClick={() => handleCurrencyChange(cur.value)}>
                {cur.label}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="contained"
            onClick={handleLoginOpen}
            sx={{
              ml: 2,
              bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)',
              color: '#181818',
              fontWeight: 800,
              px: 2.5,
              py: 0.8,
              fontSize: 14,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,225,192,0.10)',
              letterSpacing: 1,
              transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
              '&:hover': {
                bgcolor: 'linear-gradient(90deg, #FFD600 40%, #00e1c0 100%)',
                transform: 'scale(1.06)',
                boxShadow: '0 4px 16px rgba(0,225,192,0.18)',
              },
            }}
          >
            LOGIN
          </Button>
        </Box>
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle} sx={{ zIndex: 1300 }}>
          <Box sx={{ width: 260, p: 2, bgcolor: '#181c25', height: '100%' }} role="presentation" onClick={handleDrawerToggle}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#00e1c0', letterSpacing: 1, mb: 2, textAlign: 'center' }}>CryptoPulse</Typography>
            <Divider sx={{ mb: 2, bgcolor: '#23283a' }} />
            <List>
              {pages.map((page) => (
                <ListItem key={page.label} disablePadding>
                  <ListItemButton component={NavLink} to={page.path} sx={{ color: '#fff', fontWeight: 600, fontSize: 18, '&.active': { color: '#00e1c0' } }}>
                    <ListItemText primary={page.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2, bgcolor: '#23283a' }} />
            <Typography sx={{ color: '#b0b0b0', fontWeight: 600, mb: 1 }}>Currency</Typography>
            <List>
              {currencies.map((cur) => (
                <ListItem key={cur.value} disablePadding>
                  <ListItemButton onClick={() => handleCurrencyChange(cur.value)} sx={{ color: currency === cur.value ? '#00e1c0' : '#fff', fontWeight: 700 }}>
                    <ListItemText primary={cur.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2, bgcolor: '#23283a' }} />
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)',
                color: '#181818',
                fontWeight: 800,
                px: 3.5,
                py: 1.2,
                fontSize: 18,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,225,192,0.10)',
                letterSpacing: 1,
                transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                '&:hover': {
                  bgcolor: 'linear-gradient(90deg, #FFD600 40%, #00e1c0 100%)',
                  transform: 'scale(1.06)',
                  boxShadow: '0 4px 16px rgba(0,225,192,0.18)',
                },
              }}
            >
              LOGIN
            </Button>
          </Box>
        </Drawer>
        {/* Login Modal */}
        <Dialog open={loginOpen} onClose={handleLoginClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1, textAlign: 'center' }}>
            Login to CryptoPulse
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#181c25', p: 4 }}>
            {loginError && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#ff4d4f' }}>{loginError}</Alert>}
            <Box component="form" onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                sx={{ mb: 3, bgcolor: '#23283a', borderRadius: 2, input: { color: '#f3f3f3' } }}
                InputLabelProps={{ sx: { color: '#00e1c0' } }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                sx={{ mb: 3, bgcolor: '#23283a', borderRadius: 2, input: { color: '#f3f3f3' } }}
                InputLabelProps={{ sx: { color: '#00e1c0' } }}
              />
              <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
                <Button onClick={handleLoginClose} sx={{ color: '#b0b0b0', fontWeight: 700 }}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loginLoading}
                  sx={{
                    bgcolor: 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)',
                    color: '#181818',
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    fontSize: 15,
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)',
                      color: '#181818',
                    },
                    '&:disabled': { bgcolor: '#23283a', color: '#00e1c0' }
                  }}
                >
                  {loginLoading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
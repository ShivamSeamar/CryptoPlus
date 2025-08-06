import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, CircularProgress, Alert, Container } from '@mui/material';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'linear-gradient(135deg, #181c25 0%, #23283a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(35,40,58,0.95)', boxShadow: '0 4px 32px #00e1c040' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', letterSpacing: 1 }}>Login</Typography>
          <Typography sx={{ color: '#b0b0b0', mb: 3, textAlign: 'center' }}>Sign in to your CryptoPulse account</Typography>
          {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#ff4d4f' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 3, bgcolor: '#23283a', borderRadius: 2, input: { color: '#f3f3f3' } }}
              InputLabelProps={{ sx: { color: '#00e1c0' } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              sx={{ mb: 3, bgcolor: '#23283a', borderRadius: 2, input: { color: '#f3f3f3' } }}
              InputLabelProps={{ sx: { color: '#00e1c0' } }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: 'linear-gradient(90deg,rgb(66, 70, 69) 60%, #FFD600 100%)',
                color: '#181818',
                fontWeight: 700,
                py: 1.5,
                fontSize: 17,
                borderRadius: 2,
                boxShadow: '0 2px 8px #00e1c040',
                letterSpacing: 1,
                transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                '&:hover': { bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)', color: '#181818' },
                '&:disabled': { bgcolor: '#23283a', color: '#00e1c0' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 
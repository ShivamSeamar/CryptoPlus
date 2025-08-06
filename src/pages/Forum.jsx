import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Divider,
  IconButton
} from "@mui/material";
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

const Forum = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Bitcoin Price Prediction for Q4 2024",
      author: "CryptoTrader2024",
      content: "Based on the current market trends and technical analysis, I believe Bitcoin could reach $80,000 by the end of Q4. The halving event and institutional adoption are strong bullish signals. What are your thoughts?",
      timestamp: "2 hours ago",
      likes: 24,
      replies: [
        {
          id: 1,
          author: "BlockchainExpert",
          content: "I agree with your analysis. The institutional inflows and ETF approvals are creating strong support levels. However, we should also consider the macro environment and potential regulatory changes.",
          timestamp: "1 hour ago",
          likes: 12
        },
        {
          id: 2,
          author: "RiskManager",
          content: "While the fundamentals look good, I'm more conservative. I'd say $65,000-$70,000 is more realistic. Always remember to manage your risk and never invest more than you can afford to lose.",
          timestamp: "30 minutes ago",
          likes: 8
        }
      ]
    },
    {
      id: 2,
      title: "Best Altcoins to Watch This Week",
      author: "AltcoinHunter",
      content: "Here are my top picks for this week: 1) Ethereum (ETH) - Strong DeFi ecosystem, 2) Solana (SOL) - High performance, 3) Cardano (ADA) - Smart contracts development. What's your portfolio looking like?",
      timestamp: "5 hours ago",
      likes: 18,
      replies: [
        {
          id: 3,
          author: "DeFiEnthusiast",
          content: "Great picks! I'd also add Polkadot (DOT) to the list. The parachain auctions are creating interesting opportunities. Anyone else bullish on DOT?",
          timestamp: "3 hours ago",
          likes: 6
        }
      ]
    },
    {
      id: 3,
      title: "Trading Strategy: DCA vs Lump Sum Investment",
      author: "InvestmentGuru",
      content: "I've been using Dollar Cost Averaging (DCA) for the past year and it's been working well for me. Reduces emotional trading and smooths out volatility. What's your preferred strategy?",
      timestamp: "1 day ago",
      likes: 31,
      replies: [
        {
          id: 4,
          author: "LongTermHolder",
          content: "DCA all the way! I've been doing weekly purchases for 3 years now. The psychological benefits are huge - no stress about timing the market perfectly.",
          timestamp: "20 hours ago",
          likes: 15
        },
        {
          id: 5,
          author: "SwingTrader",
          content: "I prefer lump sum during major dips. More risk but higher potential returns. DCA is great for beginners though.",
          timestamp: "18 hours ago",
          likes: 9
        }
      ]
    }
  ]);

  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newReply, setNewReply] = useState("");

  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post = {
        id: Date.now(),
        title: newPost.title,
        author: "You",
        content: newPost.content,
        timestamp: "Just now",
        likes: 0,
        replies: []
      };
      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "" });
      setShowNewPostForm(false);
    }
  };

  const handleAddReply = (postId) => {
    if (newReply.trim()) {
      const reply = {
        id: Date.now(),
        author: "You",
        content: newReply,
        timestamp: "Just now",
        likes: 0
      };
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, replies: [...post.replies, reply] }
          : post
      ));
      setNewReply("");
    }
  };

  const handleLike = (postId, isReply = false, replyId = null) => {
    if (isReply) {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, replies: post.replies.map(reply => 
              reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
            )}
          : post
      ));
    } else {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'linear-gradient(135deg, #181c25 0%, #23283a 100%)', color: '#f3f3f3', fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif' }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'rgba(24,28,37,0.85)', py: 4, borderBottom: '1px solid #00e1c0', width: '100%', mb: 4, mt: { xs: 8, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 } }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'transparent', background: 'linear-gradient(90deg, #00e1c0 30%, #FFD600 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1, textAlign: 'center', fontSize: { xs: 32, md: 44 }, textShadow: '0 4px 32px rgba(0,225,192,0.18)' }}>CryptoPulse Forum</Typography>
          <Typography variant="h6" sx={{ color: '#b0b0b0', fontWeight: 500, textAlign: 'center', fontSize: { xs: 16, md: 20 } }}>
            Share strategies, discuss market trends, and connect with fellow crypto enthusiasts
          </Typography>
        </Container>
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>
        {/* Create New Post Section */}
        <Paper sx={{ bgcolor: 'rgba(35,40,58,0.85)', borderRadius: 4, p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Start a Discussion</Typography>
            <Button
              variant="contained"
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              sx={{
                bgcolor: showNewPostForm ? '#ff4d4f' : 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)',
                color: showNewPostForm ? '#fff' : '#181c25',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontSize: 16,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: showNewPostForm ? '#ff4d4f' : 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)',
                  color: '#181c25',
                },
              }}
            >
              {showNewPostForm ? 'Cancel' : 'New Post'}
            </Button>
          </Box>
          {showNewPostForm && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Post Title"
                variant="outlined"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                sx={{ mb: 2, bgcolor: '#23283a', borderRadius: 2, input: { color: '#f3f3f3' } }}
                InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              />
              <TextField
                fullWidth
                label="Share your thoughts, strategies, or questions..."
                variant="outlined"
                multiline
                minRows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                sx={{ mb: 2, bgcolor: '#23283a', borderRadius: 2, textarea: { color: '#f3f3f3' } }}
                InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              />
              <Button
                variant="contained"
                onClick={handleCreatePost}
                sx={{
                  bgcolor: 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)',
                  color: '#181c25',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  fontSize: 16,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)',
                    color: '#181c25',
                  },
                }}
              >
                Create Post
              </Button>
            </Box>
          )}
        </Paper>
        {/* Posts Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Recent Discussions</Typography>
          {posts.map((post) => (
            <Paper key={post.id} sx={{ bgcolor: '#181c25', borderRadius: 4, p: 4, mb: 3 }}>
              {/* Post Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#00e1c0', fontWeight: 700 }}>{post.title}</Typography>
                  <Typography sx={{ mt: 1, color: '#b0b0b0', fontSize: 14 }}>
                    by <Box component="span" sx={{ color: '#00e1c0' }}>{post.author}</Box> • {post.timestamp}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    onClick={() => handleLike(post.id)}
                    startIcon={<ThumbUpAltOutlinedIcon />}
                    sx={{
                      bgcolor: 'transparent',
                      border: '1px solid #2e3448',
                      color: '#f3f3f3',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      fontWeight: 600,
                      fontSize: 14,
                      minWidth: 0,
                      '&:hover': {
                        bgcolor: '#23283a',
                        borderColor: '#00e1c0',
                        color: '#00e1c0',
                      },
                    }}
                  >
                    {post.likes}
                  </Button>
                </Box>
              </Box>
              {/* Post Content */}
              <Typography sx={{ mb: 2, lineHeight: 1.6 }}>{post.content}</Typography>
              {/* Replies Section */}
              <Divider sx={{ my: 2, bgcolor: '#2e3448' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Replies ({post.replies.length})</Typography>
                <Button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  sx={{
                    bgcolor: 'transparent',
                    color: '#00e1c0',
                    fontWeight: 700,
                    fontSize: 14,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#23283a', color: '#FFD600' },
                  }}
                >
                  {expandedPost === post.id ? 'Hide Replies' : 'Show Replies'}
                </Button>
              </Box>
              {expandedPost === post.id && (
                <>
                  {/* Reply Form */}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add your reply..."
                      variant="outlined"
                      multiline
                      minRows={2}
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      sx={{ bgcolor: '#23283a', borderRadius: 2, textarea: { color: '#f3f3f3' } }}
                      InputLabelProps={{ sx: { color: '#b0b0b0' } }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAddReply(post.id)}
                      sx={{
                        bgcolor: 'linear-gradient(90deg, #00e1c0 60%, #FFD600 100%)',
                        color: '#181c25',
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontSize: 14,
                        mt: 1,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: 'linear-gradient(90deg, #FFD600 60%, #00e1c0 100%)',
                          color: '#181c25',
                        },
                      }}
                    >
                      Reply
                    </Button>
                  </Box>
                  {/* Replies List */}
                  {post.replies.map((reply) => (
                    <Paper key={reply.id} sx={{ bgcolor: '#23283a', borderRadius: 2, p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography sx={{ color: '#b0b0b0', fontSize: 14 }}>
                          <Box component="span" sx={{ color: '#00e1c0' }}>{reply.author}</Box> • {reply.timestamp}
                        </Typography>
                        <Button
                          onClick={() => handleLike(post.id, true, reply.id)}
                          startIcon={<ThumbUpAltOutlinedIcon />}
                          sx={{
                            bgcolor: 'transparent',
                            border: '1px solid #2e3448',
                            color: '#f3f3f3',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            fontWeight: 600,
                            fontSize: 12,
                            minWidth: 0,
                            '&:hover': {
                              bgcolor: '#23283a',
                              borderColor: '#00e1c0',
                              color: '#00e1c0',
                            },
                          }}
                        >
                          {reply.likes}
                        </Button>
                      </Box>
                      <Typography sx={{ lineHeight: 1.5 }}>{reply.content}</Typography>
                    </Paper>
                  ))}
                </>
              )}
            </Paper>
          ))}
        </Box>
        {/* Community Guidelines */}
        <Paper sx={{ bgcolor: '#181c25', borderRadius: 4, p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#00e1c0', fontWeight: 700 }}>Community Guidelines</Typography>
          <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.6, color: '#b0b0b0' }}>
            <li>Be respectful and constructive in your discussions</li>
            <li>Share your own analysis and experiences</li>
            <li>Always do your own research before making investment decisions</li>
            <li>No financial advice - share information, not recommendations</li>
            <li>Keep discussions focused on cryptocurrency and trading</li>
          </Box>
        </Paper>
        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4, color: "#b0b0b0", borderTop: '1px solid #2e3448' }}>
          <Typography sx={{ fontWeight: 400 }}>
            Join the conversation and share your crypto insights with the community!
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, mt: 1 }}>Remember: This is for educational purposes only. Always do your own research.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Forum; 
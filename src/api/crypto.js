const BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetch trending coins
export async function fetchTrendingCoins() {
  const res = await fetch(`${BASE_URL}/search/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending coins');
  const data = await res.json();
  return data.coins.map(c => c.item);
}

// Fetch top gainers/losers (by market cap change in 24h)
export async function fetchMarketData(vs_currency = 'usd', per_page = 50) {
  const res = await fetch(`${BASE_URL}/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=1&sparkline=false&price_change_percentage=24h`);
  if (!res.ok) throw new Error('Failed to fetch market data');
  return await res.json();
}

// Search coins by name or symbol
export async function searchCoins(query) {
  const res = await fetch(`${BASE_URL}/search?query=${query}`);
  if (!res.ok) throw new Error('Failed to search coins');
  const data = await res.json();
  return data.coins;
}

// Fetch tickers (exchange prices) for a given coin
export async function fetchCoinTickers(coinId) {
  const res = await fetch(`${BASE_URL}/coins/${coinId}/tickers`);
  if (!res.ok) throw new Error('Failed to fetch coin tickers');
  const data = await res.json();
  return data.tickers;
}

// Fetch coin details (price, market cap, etc.)
export async function fetchCoinDetail(coinId) {
  const res = await fetch(`${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
  if (!res.ok) throw new Error('Failed to fetch coin details');
  return await res.json();
}

// Fetch coin market chart (for price chart)
export async function fetchCoinMarketChart(coinId, days = 1, vs_currency = 'usd') {
  const res = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch coin market chart');
  return await res.json();
}

// Fetch market data for prediction analysis (with price changes)
export async function fetchMarketDataForPrediction(vs_currency = 'usd', per_page = 100) {
  const res = await fetch(`${BASE_URL}/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d`);
  if (!res.ok) throw new Error('Failed to fetch market data for prediction');
  return await res.json();
}

// Fetch detailed historical data for a specific coin
export async function fetchCoinHistoricalData(coinId, days = 30, vs_currency = 'usd') {
  const res = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch historical data');
  return await res.json();
} 
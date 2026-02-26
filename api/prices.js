module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: 'tickers parameter required' });

  const tickerList = tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
  const results = {};

  await Promise.all(tickerList.map(async (ticker) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data  = await response.json();
      const meta  = data?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice ?? null;
      const prev  = meta?.chartPreviousClose ?? meta?.previousClose ?? null;
      results[ticker] = { price, prev, name: meta?.shortName || ticker };
    } catch (e) {
      results[ticker] = { price: null, prev: null, name: ticker, error: e.message };
    }
  }));

  // Cache for 20 seconds on Vercel edge
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
  res.json(results);
};

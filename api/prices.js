module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: 'tickers parameter required' });

  const tickerList = tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
  const results = {};

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json,text/plain,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://finance.yahoo.com',
    'Referer': 'https://finance.yahoo.com/',
  };

  // Primary: Yahoo v7 quote endpoint — returns day change + prev close reliably
  try {
    const symbols = tickerList.join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketPreviousClose,regularMarketChange,regularMarketChangePercent,shortName`;
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      const quotes = data?.quoteResponse?.result || [];
      quotes.forEach(q => {
        results[q.symbol] = {
          price:     q.regularMarketPrice             ?? null,
          prev:      q.regularMarketPreviousClose     ?? null,
          change:    q.regularMarketChange            ?? null,
          changePct: q.regularMarketChangePercent     ?? null,
          name:      q.shortName || q.symbol,
        };
      });
    }
  } catch (_) { /* fall through */ }

  // Fallback: v8 chart API for any ticker that didn't resolve
  await Promise.all(
    tickerList.filter(t => !results[t]?.price).map(async (ticker) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`;
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data  = await response.json();
        const meta  = data?.chart?.result?.[0]?.meta;
        const price = meta?.regularMarketPrice ?? null;
        const prev  = meta?.chartPreviousClose ?? meta?.regularMarketPreviousClose ?? null;
        const change    = (price != null && prev != null) ? price - prev : null;
        const changePct = (price != null && prev != null) ? ((price - prev) / prev * 100) : null;
        results[ticker] = { price, prev, change, changePct, name: meta?.shortName || ticker };
      } catch (e) {
        results[ticker] = { price: null, prev: null, change: null, changePct: null, name: ticker, error: e.message };
      }
    })
  );

  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
  res.json(results);
};

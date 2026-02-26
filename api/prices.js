module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: 'tickers parameter required' });

  const tickerList = tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
  const results = {};

  const baseHeaders = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://finance.yahoo.com',
    'Referer': 'https://finance.yahoo.com/',
  };

  // ── Step 1: Obtain Yahoo cookie + crumb (required for authenticated quotes) ──
  let cookie = '';
  let crumb  = '';
  try {
    // Get session cookie
    const cookieRes = await fetch('https://finance.yahoo.com/', {
      headers: baseHeaders,
      redirect: 'follow',
    });
    const raw = cookieRes.headers.get('set-cookie') || '';
    // Extract A3 or similar session cookie
    const cookieParts = raw.split(',').map(c => c.split(';')[0].trim()).filter(Boolean);
    cookie = cookieParts.join('; ');

    if (cookie) {
      // Get crumb
      const crumbRes = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
        headers: { ...baseHeaders, 'Cookie': cookie },
      });
      if (crumbRes.ok) crumb = (await crumbRes.text()).trim();
    }
  } catch (_) { /* proceed without auth — will try unauthenticated */ }

  const authHeaders = cookie
    ? { ...baseHeaders, 'Cookie': cookie }
    : baseHeaders;

  // ── Step 2: Yahoo v7 quote (primary — returns day change + prev close) ──
  try {
    const symbols    = tickerList.join(',');
    const crumbParam = crumb ? `&crumb=${encodeURIComponent(crumb)}` : '';
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketPreviousClose,regularMarketChange,regularMarketChangePercent,shortName${crumbParam}`;
    const response = await fetch(url, { headers: authHeaders });
    if (response.ok) {
      const data   = await response.json();
      const quotes = data?.quoteResponse?.result || [];
      quotes.forEach(q => {
        results[q.symbol] = {
          price:     q.regularMarketPrice          ?? null,
          prev:      q.regularMarketPreviousClose  ?? null,
          change:    q.regularMarketChange         ?? null,
          changePct: q.regularMarketChangePercent  ?? null,
          name:      q.shortName || q.symbol,
        };
      });
    }
  } catch (_) { /* fall through */ }

  // ── Step 3: v8 chart API fallback (1m interval to get intraday latest) ──
  await Promise.all(
    tickerList.filter(t => !results[t]?.price).map(async (ticker) => {
      try {
        const crumbParam = crumb ? `&crumb=${encodeURIComponent(crumb)}` : '';
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d${crumbParam}`;
        const response = await fetch(url, { headers: authHeaders });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data   = await response.json();
        const result = data?.chart?.result?.[0];
        const meta   = result?.meta;

        // Pull the most recent 1m close for intraday accuracy
        let price = meta?.regularMarketPrice ?? null;
        const closes = result?.indicators?.quote?.[0]?.close || [];
        for (let i = closes.length - 1; i >= 0; i--) {
          if (closes[i] != null) { price = closes[i]; break; }
        }

        const prev      = meta?.chartPreviousClose ?? meta?.regularMarketPreviousClose ?? null;
        const change    = (price != null && prev != null) ? price - prev : null;
        const changePct = (price != null && prev != null) ? ((price - prev) / prev * 100) : null;
        results[ticker] = { price, prev, change, changePct, name: meta?.shortName || ticker };
      } catch (e) {
        results[ticker] = { price: null, prev: null, change: null, changePct: null, name: ticker, error: e.message };
      }
    })
  );

  // ── Step 4: Stooq CSV fallback for any still-missing tickers ──
  await Promise.all(
    tickerList.filter(t => !results[t]?.price).map(async (ticker) => {
      try {
        const url = `https://stooq.com/q/l/?s=${ticker.toLowerCase()}.us&f=sd2t2ohlcv&h&e=csv`;
        const response = await fetch(url, { headers: baseHeaders });
        if (!response.ok) throw new Error('stooq failed');
        const text  = await response.text();
        const lines = text.trim().split('\n');
        if (lines.length < 2) throw new Error('no data');
        const cols  = lines[1].split(',');
        // Format: Symbol,Date,Time,Open,High,Low,Close,Volume
        const price = parseFloat(cols[6]);
        if (!isNaN(price)) {
          results[ticker] = { price, prev: null, change: null, changePct: null, name: ticker };
        }
      } catch (_) {
        if (!results[ticker]) {
          results[ticker] = { price: null, prev: null, change: null, changePct: null, name: ticker, error: 'all sources failed' };
        }
      }
    })
  );

  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
  res.json(results);
};

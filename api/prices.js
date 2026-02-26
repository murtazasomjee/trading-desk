module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: 'tickers parameter required' });

  const tickerList = tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
  const results    = {};

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json,text/plain,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://finance.yahoo.com/',
  };

  // ── Primary: Yahoo v8 chart, 5-day daily range ──────────────────────────
  // Gives regularMarketPrice (live) + 5 daily closes so we can get prev close
  await Promise.all(tickerList.map(async (ticker) => {
    try {
      // 1-min intraday: gets the latest tick price during market hours
      const intraUrl  = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d`;
      // Daily: gets yesterday's close as prev
      const dailyUrl  = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`;

      const [intraRes, dailyRes] = await Promise.all([
        fetch(intraUrl,  { headers }),
        fetch(dailyUrl,  { headers }),
      ]);

      // Parse intraday for current price
      let price = null;
      if (intraRes.ok) {
        const d    = await intraRes.json();
        const meta = d?.chart?.result?.[0]?.meta;
        price = meta?.regularMarketPrice ?? null;
        // Walk back to last non-null 1m close for accuracy
        const closes = d?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
        for (let i = closes.length - 1; i >= 0; i--) {
          if (closes[i] != null) { price = closes[i]; break; }
        }
      }

      // Parse daily for prev close (second-to-last close in the series)
      let prev = null;
      if (dailyRes.ok) {
        const d        = await dailyRes.json();
        const meta     = d?.chart?.result?.[0]?.meta;
        const dCloses  = d?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
        // If market is open today, the last entry is partial — use second-to-last
        // chartPreviousClose is the cleanest signal
        prev = meta?.chartPreviousClose ?? meta?.regularMarketPreviousClose ?? null;
        if (prev == null && dCloses.length >= 2) {
          // fallback: second-to-last daily close
          for (let i = dCloses.length - 2; i >= 0; i--) {
            if (dCloses[i] != null) { prev = dCloses[i]; break; }
          }
        }
        // If price still null, grab from daily meta
        if (price == null) price = meta?.regularMarketPrice ?? null;
      }

      const change    = (price != null && prev != null) ? price - prev : null;
      const changePct = (price != null && prev != null) ? ((price - prev) / prev * 100) : null;
      const name      = (() => {
        try { return JSON.parse(dailyRes.ok ? '' : '{}'); } catch(_) { return ticker; }
      })();

      results[ticker] = { price, prev, change, changePct, name: ticker };
    } catch (e) {
      results[ticker] = { price: null, prev: null, change: null, changePct: null, name: ticker, error: e.message };
    }
  }));

  // ── Fallback: Stooq CSV for any ticker that still has no price ──────────
  await Promise.all(
    tickerList.filter(t => !results[t]?.price).map(async (ticker) => {
      try {
        // Stooq daily history — last ~5 rows — gives current close + yesterday's
        const url      = `https://stooq.com/q/d/l/?s=${ticker.toLowerCase()}.us&i=d`;
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error('stooq failed');
        const text     = await response.text();
        const lines    = text.trim().split('\n').filter(l => l && !l.startsWith('Date'));
        if (lines.length < 1) throw new Error('no data');

        // Last line = today/most recent, second-to-last = yesterday
        const todayCols = lines[lines.length - 1].split(',');
        const prevCols  = lines.length >= 2 ? lines[lines.length - 2].split(',') : null;

        const price  = parseFloat(todayCols[4]);   // Close
        const prev   = prevCols ? parseFloat(prevCols[4]) : null;
        const change    = (price && prev) ? price - prev : null;
        const changePct = (price && prev) ? ((price - prev) / prev * 100) : null;

        if (!isNaN(price)) {
          results[ticker] = { price, prev: isNaN(prev) ? null : prev, change, changePct, name: ticker };
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

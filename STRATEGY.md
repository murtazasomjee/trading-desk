# Trading Desk — Strategy Rulebook
**Challenge:** $15,452.95 → $30,000 in 30 trading days (~6 calendar weeks)
**Style:** Catalyst-driven swing trades, 3–5 day holds
**Last updated:** 27 Feb 2026

---

## 1. Trade Entry Rules

### 1.1 Scoring Card — Minimum 13/20 Required
Every new trade must be scored across four dimensions before entry. A trade scoring below 13/20 is **rejected**, no exceptions.

| Dimension | What it measures | 5 | 4 | 3 | 2 | 1 | 0 |
|-----------|-----------------|---|---|---|---|---|---|
| **Catalyst** | How clear, recent, and market-moving is the event? | Confirmed major event (earnings beat >15%, activist, M&A) | Strong event, stock-specific | Moderate catalyst | Rumour or indirect | Weak/speculative | No catalyst |
| **Technical** | Is the price in a clean setup with volume confirmation? | Textbook breakout, high volume, clean level | Good setup, moderate volume | Acceptable setup | Messy, low volume | Weak technical | Against the trend |
| **R:R** | Risk/Reward ratio (upside to stop vs downside to stop) | ≥ 3:1 | 2.5–3:1 | 2–2.5:1 | 1.5–2:1 | 1–1.5:1 | < 1:1 |
| **Context** | Is the sector/market a tailwind or headwind? | Strong sector tailwind + broad market aligned | Mild tailwind | Neutral | Mild headwind | Strong headwind | Sector in freefall |

**Notes on scoring:**
- R:R is the hardest filter. A trade with excellent catalyst/technical/context but poor R:R should still fail if it scores < 13 overall.
- Below 2:1 R:R (score 0 or 1) means the stop is too wide or the target is too conservative — fix the structure, don't override the rule.
- Current book audit: CRM 12/20 ✗, SJM 12/20 ✗, PYPL 13/20 ✓. CRM and SJM were entered before this framework existed — they are held on thesis merit but would not pass entry today at current stop/target levels.

### 1.2 R:R Minimum — Hard Floor
- **Minimum acceptable R:R: 3:1**. Target: 4:1 or better.
- The prior floor of 2:1 was designed for capital preservation over the long run. At 2:1 R:R and a 50% win rate, expectancy barely covers slippage. At 3:1 R:R and 50% win rate, expectancy doubles. At 4:1 R:R you can be wrong 60% of the time and still be net positive.
- Calculate from actual entry price, stop, and target — not approximate ranges.
- If R:R is below 3:1 at intended entry, either: (a) tighten the stop to a defensible technical level, or (b) raise the target to a clear resistance level. If neither is possible without distorting the trade, **do not enter**.
- **Note on the scoring card:** The R:R dimension scores 3/5 at 2–2.5:1. Under the updated floor, any trade scoring R:R ≤ 3 on this dimension (i.e., below 2.5:1) requires explicit justification in Score notes — a mechanical pass on the scorecard does not override this floor.

### 1.3 Position Sizing — Percentage-Based Risk (Compounding)
- **Standard risk per trade: 3.25% of current account equity**, measured at the start of each trading day.
- Position size = (account equity × 0.0325) / (entry price − stop price).
- Example at $15,453: risk = $502. At $18,000: risk = $585. At $22,000: risk = $715. The size grows as the account grows — this is the compounding mechanism that makes the target achievable.
- **Conviction ladder** — high-conviction setups earn larger allocation, not just the same minimum:
  - Score 13–14/20: standard sizing (3.25% risk)
  - Score 15–16/20: enhanced sizing (4.5% risk)
  - Score 17–20/20: maximum sizing (6.0% risk, hard cap regardless of account size)
- Hard cap: no single position can represent more than 35% of account equity at entry.
- **Why this replaced fixed $500:** Fixed dollar risk doesn't compound. After winning trades, the risk percentage shrinks and the account growth stalls. Percentage-based risk ensures every winning cycle funds a proportionally larger next cycle.

### 1.4 Entry Trigger — No Chasing
- Only enter within the defined entry range. If price has moved more than 2% beyond the entry range, do not enter.
- Entry is only valid if volume is above the 20-day average on the entry candle or session.
- Prefer entries on minor pullbacks to VWAP or the prior day's close rather than chasing the initial spike.

### 1.7 No Pre-Earnings Entries
- **Never enter a position with an earnings report pending within the hold window.** Holding through earnings is a binary coin flip, not a swing trade.
- Post-earnings plays (entering after the report is out) are allowed and preferred — the catalyst is confirmed, the market's initial reaction is known, and R:R can be calculated against a real stop.
- The correct time to assess an earnings play is **after the report, not before.** See Section 4.1 for the AH earnings window rule.

### 1.5 Thesis Killers — Required at Entry
- Before entering any trade, define exactly 3 events that would invalidate the thesis.
- These must be specific (named events or data points), not generic ("if the stock goes down").
- These are documented in `positions.json` and reviewed at every check-in.

### 1.6 Second-Order Risk Check
- Before entering, ask: *what news about OTHER companies could hurt this stock?*
- For per-seat SaaS (CRM, etc.): enterprise customer layoffs.
- For consumer staples (SJM, etc.): macro data reducing defensive rotation.
- For mean-reversion plays (PYPL, etc.): rumour denial, management disappointment.
- If a plausible secondary risk exists, it must be added to the thesis killers list.

---

## 2. Periodic Review Protocol

### 2.1 Pre-Market Check (Every Trading Day, ~5 Minutes)
**What to scan:**
- Any overnight or pre-market news on each open ticker.
- Any news on major customers, sector peers, or macro data releases.
- Pre-market price vs. entry — flag any position gapping more than 2% against.

**Triggers:**
- Gap > 2% against: move to Thesis Review before open.
- Gap > 3% on meaningful news: prepare exit-at-open plan.
- No news, flat price: standard monitoring.

### 2.2 Mid-Session Check (Once, Around Midday)
**What to review:**
- Is the stock tracking toward the target? At minimum 15–20% of target move by day 2.
- Is volume confirming the move or drying up?
- Has anything changed in the sector since the open?

**Time Stop trigger:** If a position has made less than 25% of the expected move (entry → target) by the close of Day 2, **exit at open on Day 3. No review, no exceptions.** In a 30-trading-day challenge, a stalling trade is not just a bad trade — it is capital that is not compounding. Opportunity cost is a real loss. The catalyst is stale; redeploy immediately.

### 2.3 End-of-Day Review (Every Trading Day, ~10 Minutes)
**Four questions for each position:**
1. Is the original catalyst still intact?
2. Has any thesis killer been triggered or come materially closer to triggering?
3. What is the current R:R given today's close vs. stop vs. target?
4. Is the sector/market environment still a tailwind?

**Update `reviewNotes` and `thesisRisk` in `positions.json` after every review.**

### 2.4 Thesis Risk Levels
| Level | Label | Meaning | Action |
|-------|-------|---------|--------|
| 1 | 🟢 Monitor | Thesis fully intact | Standard monitoring protocol |
| 2 | 🟡 Review | Thesis weakened — secondary risk activated or momentum slowing | Active daily review, consider tightening stop |
| 3 | 🔴 Exit Signal | Thesis broken — catalyst reversed, major thesis killer triggered | Plan exit at next open or on first bounce |

---

## 3. Exit Rules

### 3.1 Planned Exits (In Order of Priority)
1. **Thesis invalidation** — original reason for the trade is no longer true. Exit regardless of price, even if profitable.
2. **Time stop** — less than 25% of expected move by close of Day 2. Exit at open Day 3, automatically, no review.
3. **Pre-market gap >3% against on meaningful news** — do not wait for open. Assess at open, exit into first bounce if thesis is uncertain.
4. **Stop loss hit** — price reaches the defined stop. This is the last-resort mechanical exit.

### 3.2 Partial Exit Rule — Tiered by Conviction
The partial exit rule applies differently depending on the trade's score. High-conviction trades deserve to run; borderline trades deserve protection.

**Scores 13–15/20 (minimum-pass trades):**
- At 50% of the distance to target, sell half the position.
- Immediately move the stop on the remaining half to breakeven (entry price).
- This converts the remaining half into a free trade — protected downside, open upside.
- Example: CRM entry $196.50, target $212. At $204.25, sell 15 shares. Move stop on remaining 15 to $196.50.

**Scores 16–20/20 (high-conviction trades):**
- No partial exit. Let the full position run to target.
- At 50% of the distance to target, tighten the stop to a technical level that protects at least 60% of unrealised gains — but do not sell shares.
- Exit the full position only at target, on thesis break, or on time stop.
- Why: The partial exit on a 3:1 trade reduces your effective average win to approximately 2:1. On your best setups, that cost is too high. Ride your winners.

**Universal rule:** Never let a position that has reached 75% of its target distance turn into a loss. At 75%, stop moves to at minimum 40% of target distance from entry, regardless of score.

### 3.3 Target Hit
- When price reaches the full target, **exit the full remaining position**.
- Do not hold through the target hoping for more — the R:R that justified the trade was calculated to the target level.
- If the thesis has materially strengthened since entry (new catalyst), reassess and set a new target rather than holding open-endedly.

---

## 4. Special Entry Contexts

### 4.1 Post-Earnings AH Entry Window
When a company reports after hours with a significant beat, there is a short entry window before the tape moves too far.

- **Window:** First 15–30 minutes of AH trading after the report is published.
- **Why it closes:** Thin AH volume means price can gap several percent quickly. Once it moves >3% from the initial post-report level, the original R:R is usually broken.
- **Process:** As soon as a strong earnings report hits, immediately calculate: entry (current AH price), stop (below key technical support or AH low), target (pre-earnings resistance or analyst consensus). Score it. If it passes 13/20 and R:R ≥ 3:1, enter.
- **If the window closes:** Do not chase into AH. Wait for a pullback setup the next morning. Score it fresh from the new level — the prior AH setup is void.
- **Lesson from DELL (26 Feb 2026):** DELL reported a strong beat ($3.89 EPS vs $3.52 expected). At $125 initial AH price, R:R was 3.4:1 — a strong pass. By the time analysis was completed, price had moved to $134 and R:R flipped to 0.5:1. Entry window had closed. Correct action: wait for morning pullback, re-score.

### 4.1a Gap Trade Stop Placement — Do Not Default to Gap Bottom
For post-earnings gap setups (next-morning entries after an AH report), the stop must be the **tightest technically defensible level within the gap** — not automatically the bottom of the full gap range.

**Three valid stop levels for gap trades (in order of preference for R:R):**
1. **Gap-open price / first 30-minute session low** — tightest defensible stop. If the stock cannot hold the level it opened at, the gap thesis is broken.
2. **Mid-gap VWAP or prior AH session low** — moderate stop. Allows more noise but still tied to a real technical level.
3. **Bottom of the full gap range (prior close)** — widest stop. Only use if the gap is narrow (<3%) and the prior close is a meaningful support level.

**Why this matters:** Using the gap bottom as the default stop produces unnecessarily wide risk that breaks the R:R math and causes valid setups to be rejected. The gap thesis only requires the stock to hold above where it gapped — not above where it gapped *from*.

**Lesson from DELL (27 Feb 2026):** At $134.77, the correct stop was $131 (gap-open support), not $127 (gap bottom). With a $131 stop: R:R = (147 − 134.77) / (134.77 − 131) = 3.24:1 — a valid 16/20 enhanced-sizing trade. Using $127 made the required target $158, which appeared too aggressive. DELL reached $147 the same day without touching $131. The conservative stop placement caused a valid setup to be incorrectly rejected. Cost: ~$2,250 in missed profit.

### 4.2 Rotation Rules
When fully invested and a high-conviction new setup appears, rotation may be considered — but only under strict conditions.

**Rotation is only valid if ALL of the following are true:**
1. The new setup scores **≥ 15/20** (materially better than the minimum).
2. The new setup has **R:R ≥ 3:1** (preferred tier, not minimum).
3. The position being rotated out scores **< 13/20** under current conditions (i.e., it would fail entry today).
4. The position being rotated out has no imminent catalyst within 2 trading days that could recover value.
5. The rotation does not incur a loss greater than 50% of the maximum risk budget ($250) unless the thesis is broken.

**Rotation process:**
- Score both positions fully before deciding.
- State explicitly: "I am rotating because [old position] fails entry criteria today and [new position] scores [X]/20 with [Y:1] R:R."
- If the old position would still pass entry today (≥ 13/20), hold it — do not rotate purely on opportunity cost.

**Lesson from DELL/CRM (26 Feb 2026):** CRM→DELL rotation was proposed when DELL was at $125. CRM was at 12/20 (pre-framework violation, declining thesis). The rotation logic was directionally correct. However, the AH entry window for DELL closed before the rotation could execute. Always check the entry window before initiating a rotation plan.

### 4.3 Minimum Scan Width for Morning Reports
A morning report that identifies only one pick is likely the result of a too-narrow scan. Before declaring the report complete:

- Scan at minimum **4 distinct sectors** (e.g., tech, consumer, healthcare, industrials).
- Scan at minimum **1 macro layer** (rates, commodities, crypto, geopolitical — see §4.4).
- Review at minimum **10 catalyst-driven candidates** before filtering to scored picks.
- If fewer than 3 candidates pass the threshold after a genuine broad scan, state explicitly that the market is in a low-opportunity environment and explain why.
- Never present a single-pick report as exhaustive without acknowledging the scan width.

**Lesson from mock report (26 Feb 2026):** Initial report identified only NTNX. When pushed, a broader scan found CELH (+37% EPS beat, 117% YoY) and DELL (record FY26 + AI guidance). The opportunity set was there; the first scan was too narrow.

### 4.4 Macro, Geopolitical & ETF Plays
The strategy is not limited to individual equities. Macro and thematic plays are valid when grounded in a real-world catalyst — not just a theme. These expand the opportunity set and often provide cleaner setups than single stocks because they remove company-specific noise (no earnings surprise, no CEO scandal, no one bad quarter).

**Why these belong in the strategy:**
The real world drives markets — rate decisions, geopolitical events, commodity supply shocks, regime changes, inflation prints. Ignoring the macro layer means operating in a micro bubble while the biggest moves happen around you. A rising-rate environment that kills growth stocks is the same environment that sends TLT down and IBIT sideways. Understanding the macro doesn't just find new trades — it validates or undermines the existing book.

**The core requirement: a catalyst event within the hold window.**
"Gold is a good store of value" is not a trade. "Gold is pulling back to the 21-day MA after a run on safe-haven demand, with next week's CPI likely to reignite the bid" is a trade with structure. Every macro/ETF play must have an identifiable near-term event or technical trigger — not just a multi-month theme.

**Scoring card interpretation for macro plays:**

| Dimension | Adaptation for Macro/ETF |
|-----------|--------------------------|
| **Catalyst** | Use geopolitical events, scheduled macro data (CPI, FOMC, NFP), supply/demand shocks, regulatory decisions. Score the same scale — a surprise Fed pivot is a 5, a vague "inflation fears" narrative is a 2. |
| **Technical** | ETFs typically have cleaner technicals than individual stocks — more liquid, less gap risk, respected moving averages. Score normally. A pullback to the 21-day in an established trend scores well. |
| **R:R** | Calculate identically: (target − entry) ÷ (entry − stop). Note: ETF moves are measured in %, not gap fills. Tighten stops to technical levels to preserve R:R. |
| **Context** | For macro plays, context extends to: dollar direction, real yields, global equity sentiment, and cross-asset flows. A GLD trade in a rising-dollar environment is fighting the context. |

**Instrument-specific guidance:**

*GLD (Gold ETF) — best macro fit*
- Driven by: real yields (inverse), dollar (inverse), geopolitical risk premium, central bank buying.
- Thesis killers: surprise dollar surge, de-escalation of geopolitical tension, surprise Fed hawkishness.
- Hold window: 3–7 days on catalyst events; trend-following holds can extend.
- Scoring note: GLD trends well and respects technical levels. In an established uptrend, pullbacks to the 21-day MA are high-probability entries. Context score should reflect dollar/yield environment.

*IBIT (Bitcoin ETF) — valid with specific catalyst only*
- Driven by: institutional inflow/outflow data, regulatory developments, halving cycle, macro risk-on/off.
- NOT a valid thesis: "crypto is strong right now." Bitcoin sentiment is not a confirmed catalyst.
- Thesis killers: major regulatory crackdown, exchange failure/contagion event, macro risk-off forcing de-leveraging.
- Scoring note: High volatility makes 3:1 R:R structurally achievable, but false breakouts are frequent. Require a specific news catalyst (e.g., ETF inflow record, SEC clarity, major institutional allocation announcement) before entering. Score R:R conservatively — use wider stops to account for noise.

*TLT (Long Treasury ETF) — best around scheduled macro events*
- Driven by: Fed rate expectations, CPI/PCE prints, recession fears, flight-to-safety.
- Most useful as a 1–2 day event trade around scheduled catalysts (FOMC decision, CPI release). Swing holding between events is slow and low-R:R.
- Thesis killers: surprise hot inflation print, unexpected Fed hawkishness, strong labour market data.
- Scoring note: Low day-to-day volatility makes the R:R math challenging without a scheduled catalyst. Only enter when a specific data print is due within the hold window and consensus is skewed enough to create asymmetry.

*Thematic / Sector ETFs (SMH, XLF, XLE, ARKK, etc.) — strong fit*
- These combine sector trend with a shared catalyst across the basket, removing single-stock risk.
- Example: SMH after NVDA beats — the entire semiconductor basket benefits, with less single-stock risk than buying NVDA directly at an elevated price.
- Score the same way as individual stocks. The catalyst dimension reflects the shared sector event; the technical dimension reflects the ETF chart, not the individual components.
- Second-order risk check still applies: for SMH, the second-order risk is a China export restriction on semiconductors. For XLF, it's a surprise credit event at a major bank.

**Position sizing:**
Use the same $500 max risk rule. Because ETF moves are percentage-based rather than driven by gap fills, be careful about stop placement — a stop that is technically correct but only 0.5% away will be hit by normal noise in a liquid ETF. Aim for stops at meaningful technical levels (prior lows, moving averages) even if that means the position size becomes smaller.

---

## 5. Morning Report Format

Every trading day, the morning report will cover:

1. **Overnight developments** — any news on open positions or their thesis killers.
2. **Pre-market read** — where each position is trading vs. entry and stop.
3. **Thesis status update** — 🟢/🟡/🔴 for each position with one-line reasoning.
4. **Thesis killer check** — explicitly name each position's 3 killers and state whether any has been triggered or moved materially closer since the prior session.
5. **Action items** — specific things to watch or decisions to make at open.
6. **New pick candidates** (if any) — must include full 4-dimension score, R:R, entry range, stop, target, position size, and thesis killers before recommendation. See §4.3 for minimum scan width and §4.4 for macro/ETF scoring guidance.
7. **Macro layer read** — one-paragraph summary of where rates, dollar, gold, and crypto are sitting and whether they present any trade setups or risks to the existing book.

---

## 6. Mid-Day Check-In Format

1. **Price vs. target progress** — where each position sits on the entry→target journey.
2. **Volume check** — confirming or warning.
3. **Thesis status** — any change since morning?
4. **Intraday alerts** — any news breaking since open.
5. **Hold / adjust stop / exit** recommendation for each position.

---

## 7. New Pick Recommendation Template

Before any new pick is recommended, it must be presented in this format:

```
TICKER: [TICKER]
Category: Primary / Secondary / Speculative

Catalyst: [Specific event and date]
Thesis: [2–3 sentence explanation]

Entry range: $X – $Y
Stop loss: $Z (reason: [technical level])
Target: $A (reason: [resistance level])
Position size: [shares] ([calculation: account equity × risk% / stop distance per share])
R:R: [X:1]
Hold time: [X–Y days]

Scorecard:
  Catalyst:  [X]/5
  Technical: [X]/5
  R:R:       [X]/5
  Context:   [X]/5
  Total:     [XX]/20 — [Pass ≥13 / Fail <13]

Thesis Killers:
  1. [Specific event]
  2. [Specific event]
  3. [Specific event]

Second-order risks: [What news about OTHER companies could hurt this?]
Score notes: [Any caveats or close calls on scoring]
```

---

## 8. Goal Math Awareness

**Target:** $30,000 from $15,452.95 = +94.1% return required over 30 trading days (~6 calendar weeks).

**The correct cycle math:**
30 trading days at 3–5 day average holds = 6–10 complete trade cycles. To compound $15,452.95 to $30,000 over this range:
- Over 6 cycles: each cycle must net ~+11.7% (1.117⁶ = 1.94)
- Over 8 cycles: each cycle must net ~+8.6% (1.086⁸ = 1.94)
- Over 10 cycles: each cycle must net ~+6.9% (1.069¹⁰ = 1.94)

**What generates 8–12% net per cycle:**
With 3.25% percentage-based risk, 3:1 R:R, and 2–3 concurrent positions per cycle:
- Single winning trade: +9.75% of equity
- Single losing trade: −3.25% of equity
- At 60% win rate across 3 trades per cycle: (1.8 × 9.75%) − (1.2 × 3.25%) = +17.55% − 3.9% = ~+13.6% per cycle gross
- After slippage, commissions, and flat trades: realistically **+8–11% net per cycle**

This means the target is achievable with disciplined execution — it does not require extraordinary luck or outlier wins. It requires consistent 3:1+ R:R setups, a 55–60% win rate, full deployment of capital into qualifying trades, and the compounding to be respected by sizing up as the account grows.

**What breaks the math:**
- Holding losing positions past the time stop (dead capital)
- Sizing trades at fixed $500 rather than % of equity (compounding breaks)
- Taking 2:1 R:R trades out of impatience (expectancy collapses)
- Partial-exiting high-conviction trades at halfway (best wins get capped)

**Do not override the scoring or R:R rules to "catch up"** if the challenge is behind pace. Bigger bets on weaker setups is precisely how challenges fail in weeks 3–4. The edge comes from discipline held consistently, not from a single redemption trade.

---

## 9. Framework Violations Log

| Date | Ticker | Violation | Notes |
|------|--------|-----------|-------|
| 26/02/2026 | CRM | R:R 1.35:1 (below 2:1 minimum) | Pre-framework entry. Held on thesis merit. |
| 26/02/2026 | SJM | R:R 0.62:1 (below 2:1 minimum) | Pre-framework entry. Held on thesis merit. |

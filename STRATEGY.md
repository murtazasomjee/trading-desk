# Trading Desk — Strategy Rulebook
**Challenge:** $15,452.95 → $30,000 in 30 days
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
- **Minimum acceptable R:R: 2:1**. Preferred: 3:1 or better.
- Calculate from actual entry price, stop, and target — not approximate ranges.
- If R:R is below 2:1 at intended entry, either: (a) tighten the stop to a defensible technical level, or (b) raise the target to a clear resistance level. If neither is possible without distorting the trade, **do not enter**.

### 1.3 Position Sizing — Fixed Dollar Risk
- **Max risk per trade: $500** (approximately 3.2% of starting capital).
- Position size = $500 / (entry price − stop price).
- Example: PYPL entry $44.62, stop $41.50 → risk $3.12/share → size = 160 shares.
- This keeps maximum drawdown controlled regardless of stock price or volatility.
- Do not override sizing based on conviction — conviction is reflected in the score, not the size.

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

**Time Stop trigger:** If a position has made less than 33% of the expected move (entry → target) within 2 full trading days, flag for exit review. The catalyst is likely stale.

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
2. **Time stop** — less than 33% of expected move in 2 full trading days. Exit and redeploy.
3. **Pre-market gap >3% against on meaningful news** — do not wait for open. Assess at open, exit into first bounce if thesis is uncertain.
4. **Stop loss hit** — price reaches the defined stop. This is the last-resort mechanical exit.

### 3.2 Partial Exit Rule — Lock In Profits
- When a position reaches **50% of the distance to target**, sell half the position.
- Immediately move the stop on the remaining half to **breakeven** (entry price).
- This converts the remaining position into a free trade — maximum upside, zero downside on the original capital.
- Example: CRM entry $196.50, target $212. At $204.25 (50% of the way), sell 15 shares. Move stop on remaining 15 shares to $196.50.

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
- **Process:** As soon as a strong earnings report hits, immediately calculate: entry (current AH price), stop (below key technical support or AH low), target (pre-earnings resistance or analyst consensus). Score it. If it passes 13/20 and R:R ≥ 2:1, enter.
- **If the window closes:** Do not chase into AH. Wait for a pullback setup the next morning. Score it fresh from the new level — the prior AH setup is void.
- **Lesson from DELL (26 Feb 2026):** DELL reported a strong beat ($3.89 EPS vs $3.52 expected). At $125 initial AH price, R:R was 3.4:1 — a strong pass. By the time analysis was completed, price had moved to $134 and R:R flipped to 0.5:1. Entry window had closed. Correct action: wait for morning pullback, re-score.

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
- Review at minimum **10 catalyst-driven candidates** before filtering to scored picks.
- If fewer than 3 candidates pass the threshold after a genuine broad scan, state explicitly that the market is in a low-opportunity environment and explain why.
- Never present a single-pick report as exhaustive without acknowledging the scan width.

**Lesson from mock report (26 Feb 2026):** Initial report identified only NTNX. When pushed, a broader scan found CELH (+37% EPS beat, 117% YoY) and DELL (record FY26 + AI guidance). The opportunity set was there; the first scan was too narrow.

---

## 5. Morning Report Format

Every trading day, the morning report will cover:

1. **Overnight developments** — any news on open positions or their thesis killers.
2. **Pre-market read** — where each position is trading vs. entry and stop.
3. **Thesis status update** — 🟢/🟡/🔴 for each position with one-line reasoning.
4. **Thesis killer check** — explicitly name each position's 3 killers and state whether any has been triggered or moved materially closer since the prior session.
5. **Action items** — specific things to watch or decisions to make at open.
6. **New pick candidates** (if any) — must include full 4-dimension score, R:R, entry range, stop, target, position size, and thesis killers before recommendation. See Section 4.3 for minimum scan width.

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
Position size: [shares] ([calculation: $500 risk / stop distance])
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

- **Target:** $30,000 from $15,452.95 = +94.1% return required.
- **Realistic path:** Multiple trade cycles, compounding gains. 11% per cycle × 7 cycles ≈ target (approximate).
- The strategy prioritises **risk-adjusted return per trade** over swinging for large single gains.
- A 100% win rate at 3:1 R:R is impossible. Assuming 50% win rate, 3:1 R:R trades yield net positive expectancy. The compounding does the work if discipline holds.
- **Do not override the scoring or R:R rules to "catch up"** if the challenge is behind pace. Bigger bets on weaker setups is how challenges fail.

---

## 9. Framework Violations Log

| Date | Ticker | Violation | Notes |
|------|--------|-----------|-------|
| 26/02/2026 | CRM | R:R 1.35:1 (below 2:1 minimum) | Pre-framework entry. Held on thesis merit. |
| 26/02/2026 | SJM | R:R 0.62:1 (below 2:1 minimum) | Pre-framework entry. Held on thesis merit. |

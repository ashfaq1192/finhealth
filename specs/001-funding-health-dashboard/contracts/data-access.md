# Data Access Contracts: US Business Funding Climate Dashboard

**Branch**: `001-funding-health-dashboard` | **Date**: 2026-03-07

The frontend reads directly from Supabase using the public anon key.
There is no custom API server. These contracts define the exact Supabase
queries the frontend MUST use.

---

## Frontend Queries (Supabase JS Client)

### Q1 — Latest Score (Homepage, above fold)

Fetches the single most recent score record for display.

```typescript
const { data } = await supabase
  .from('daily_scores')
  .select('date, health_score, status_label, reasoning')
  .order('date', { ascending: false })
  .limit(1)
  .single()
```

**Returns**:
```typescript
{
  date: string          // "YYYY-MM-DD"
  health_score: number  // 0-100
  status_label: string  // "Optimal" | "Moderate" | "Risky" | "Critical"
  reasoning: string[]   // array of exactly 3 strings
}
```

**Used by**: ScoreCard component, staleness detection logic

---

### Q2 — Score Trend (Homepage, chart)

Fetches the last 30 score records for the trend line chart.

```typescript
const { data } = await supabase
  .from('daily_scores')
  .select('date, health_score')
  .order('date', { ascending: true })
  .limit(30)
```

**Returns**: Array of `{ date: string, health_score: number }`

**Used by**: TrendChart component (recharts LineChart)

---

### Q3 — Blog Post Listing (Blog page)

Fetches paginated blog posts in reverse-chronological order.

```typescript
const { data } = await supabase
  .from('blog_posts')
  .select('date, title, slug, category, meta_description')
  .order('date', { ascending: false })
  .range(0, 9)  // 10 per page
```

**Returns**: Array of:
```typescript
{
  date: string
  title: string
  slug: string
  category: string
  meta_description: string
}
```

**Used by**: BlogList component

---

### Q4 — Single Blog Post (Blog post page)

Fetches a single blog post by its URL slug.

```typescript
const { data } = await supabase
  .from('blog_posts')
  .select('date, title, slug, content, meta_description, category')
  .eq('slug', slug)
  .single()
```

**Returns**:
```typescript
{
  date: string
  title: string
  slug: string
  content: string       // Full markdown body
  meta_description: string
  category: string
}
```

**Used by**: Blog post page (`/blog/[slug]`)

---

## Backend Writes (Python supabase-py — service_role key)

### W1 — Upsert Score Record

```python
supabase.table("daily_scores").upsert(
    {
        "date": "2026-03-07",
        "health_score": 72,
        "status_label": "Moderate",
        "reasoning": ["...", "...", "..."],
        "dprime": 7.5,
        "drtscilm": 12.3,
        "drtscis": 8.1,
        "t10y2y": 0.45,
        "icsa": 230000,
        "busappwnsaus": 82500,
        "busapp_trending_up": True,
        "updated_at": "2026-03-07T14:00:00Z"
    },
    on_conflict="date"
).execute()
```

### W2 — Upsert Blog Post

```python
supabase.table("blog_posts").upsert(
    {
        "date": "2026-03-07",
        "title": "Trucking Finance Outlook: March 2026",
        "slug": "2026-03-07-trucking-finance-outlook",
        "content": "...",  # 600+ word markdown
        "meta_description": "...",  # max 160 chars
        "category": "Trucking",
        "score_id": "<uuid-of-score-record>",
        "updated_at": "2026-03-07T14:05:00Z"
    },
    on_conflict="date"
).execute()
```

---

## Staleness Logic (Frontend — TypeScript)

Run after Q1 returns. Determines display state.

```typescript
type ScoreState = 'current' | 'stale' | 'unavailable' | 'cold-start'

function getScoreState(latestDate: string | null): ScoreState {
  if (!latestDate) return 'cold-start'
  const daysDiff = differenceInDays(new Date(), parseISO(latestDate))
  if (daysDiff === 0) return 'current'
  if (daysDiff <= 3) return 'stale'
  return 'unavailable'
}
```

**State → UI mapping**:
| State | Score Shown | "as of" Label | AdSense |
|---|---|---|---|
| `current` | Yes | Yes (always) | Yes |
| `stale` | Yes | Yes + warning | Yes |
| `unavailable` | No | No | No |
| `cold-start` | No | No | No |

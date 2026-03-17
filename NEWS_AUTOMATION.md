# Automated AI News Fetcher

This GitHub Action automatically fetches AI-related news from major tech sites and adds them to your Supabase database daily.

## News Sources

The bot fetches from these major tech sites:
- **TechCrunch** - AI category
- **VentureBeat** - AI section
- **The Verge** - AI coverage
- **Ars Technica** - Artificial Intelligence
- **WIRED** - AI articles
- **AI News** - Dedicated AI news site

## Setup Instructions

### 1. Get Supabase Service Key

The service key bypasses Row Level Security to insert news articles automatically.

1. Go to your Supabase project: https://supabase.com/dashboard/project/tdxxvweafelvgxoujpml
2. Click **Settings** → **API**
3. Copy the **service_role key** (not the anon key!)
   - ⚠️ **Warning**: This key has admin privileges, keep it secret!

### 2. Add GitHub Secrets

1. Go to your repository: https://github.com/AiltonDomingues/ia-explicada-hub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `SUPABASE_URL`
   - Value: `https://tdxxvweafelvgxoujpml.supabase.co`

   **Secret 2:**
   - Name: `SUPABASE_SERVICE_KEY`
   - Value: `[Your service_role key from step 1]`

### 3. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. If prompted, click **"I understand my workflows, go ahead and enable them"**
3. The workflow will now run automatically every day at 9:00 AM UTC (6:00 AM Brasilia time)

### 4. Manual Trigger (Optional)

You can manually trigger the news fetch:
1. Go to **Actions** tab
2. Click **Fetch AI News Daily** workflow
3. Click **Run workflow** → **Run workflow**

## How It Works

1. **Scheduled Run**: GitHub Action runs daily at 9:00 AM UTC
2. **RSS Parsing**: Fetches latest articles from configured RSS feeds
3. **Smart Filtering**:
   - Checks if article already exists (by link)
   - Extracts clean descriptions (max 250 chars)
   - Automatically generates tags based on content (GPT, ChatGPT, Machine Learning, etc.)
   - Calculates reading time
4. **Database Insert**: Adds new articles to Supabase `noticias` table
5. **Logging**: Records fetch results in `.github/fetch-log.txt`

## Customization

### Change Schedule

Edit `.github/workflows/fetch-news.yml`:

```yaml
schedule:
  - cron: '0 9 * * *'  # Current: Daily at 9 AM UTC
  # Examples:
  # - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 12 * * 1-5'  # Weekdays at noon
```

### Add/Remove News Sources

Edit `scripts/fetch-news.js`:

```javascript
const RSS_FEEDS = [
  {
    url: 'https://your-site.com/rss',
    source: 'Your Site',
    category: 'Categoria'
  },
  // ... add more
];
```

### Change Article Limits

In `fetch-news.js`, line ~115:

```javascript
for (const item of feedData.items.slice(0, 5)) { // Change 5 to desired number
```

## Testing Locally

1. Install dependencies:
   ```bash
   cd scripts
   npm install
   ```

2. Set environment variables:
   ```bash
   $env:SUPABASE_URL="https://tdxxvweafelvgxoujpml.supabase.co"
   $env:SUPABASE_SERVICE_KEY="your-service-key"
   ```

3. Run the script:
   ```bash
   node fetch-news.js
   ```

## Monitoring

- Check **Actions** tab in GitHub to see run history
- View `.github/fetch-log.txt` for timestamps
- Check Supabase Table Editor to verify imported articles

## Troubleshooting

### No articles imported
- Check if RSS feeds are accessible
- Verify articles aren't already in database
- Check GitHub Actions logs for errors

### Authentication errors
- Verify `SUPABASE_SERVICE_KEY` is the service_role key (not anon key)
- Confirm secrets are set correctly in repository settings

### Duplicate articles
- Script checks by link, so same link won't be imported twice
- If source changes URLs, duplicates may occur

## Security Notes

- ✅ Service key is stored as GitHub secret (encrypted)
- ✅ Service key never exposed in logs or code
- ✅ Workflow only runs in your repository
- ⚠️ Don't commit `.env` files with keys
- ⚠️ Don't share service_role key publicly

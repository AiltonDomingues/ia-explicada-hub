# Automated Content Fetching

This repository uses GitHub Actions to automatically fetch AI-related content from various sources and populate your Supabase database.

## 📰 News Fetcher (Daily)

Fetches breaking AI news from Brazilian tech sites **every day at 9:00 AM UTC** (6:00 AM Brasilia).

### News Sources
- **Olhar Digital** - Internet & Tech
- **Canaltech** - Technology news
- **TecMundo** - Tech articles
- **Tecnoblog** - Tech blog
- **Startupi** - Startup news
- **Meio Bit** - Tech commentary

### Schedule
- **Frequency**: Daily
- **Time**: 9:00 AM UTC (6:00 AM Brasilia)
- **Articles per run**: ~5-30 new articles
- **Workflow**: `.github/workflows/fetch-news.yml`
- **Script**: `scripts/fetch-news.js`

---

## 📚 Articles Fetcher (Weekly)

Fetches in-depth AI articles and tutorials **every Sunday at 10:00 AM UTC** (7:00 AM Brasilia).

### Article Sources
- **Towards Data Science** (Medium) - English data science articles
- **Medium AI** - English AI content
- **Dev.to** - English developer articles
- **Tecnoblog** - Portuguese tech articles
- **Alura** - Portuguese tutorials

### Features
- Filters for AI-relevant content only
- Supports both English and Portuguese
- Extracts author, reading time, categories
- Smart tag detection
- Validates content quality (min 50 chars description)

### Schedule
- **Frequency**: Weekly (Sundays)
- **Time**: 10:00 AM UTC (7:00 AM Brasilia)
- **Articles per run**: ~5-15 quality articles
- **Workflow**: `.github/workflows/fetch-articles.yml`
- **Script**: `scripts/fetch-articles.js`

---

## 🔧 Setup Instructions

### 1. Get Supabase Service Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tdxxvweafelvgxoujpml)
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
3. Workflows will now run automatically

### 4. Manual Trigger (Optional)

You can manually trigger either workflow:
1. Go to **Actions** tab
2. Select the workflow:
   - **Fetch AI News Daily** for news
   - **Fetch AI Articles Weekly** for articles
3. Click **Run workflow** → **Run workflow**

---

## 🎯 How It Works

### News Workflow
1. **Scheduled Run**: GitHub Action runs daily at 9 AM UTC
2. **RSS Parsing**: Fetches latest articles from Brazilian tech sites
3. **Smart Processing**:
   - Checks if article already exists (by link)
   - Creates clean summaries (max 200 chars)
   - Auto-detects categories (Lançamentos, Investimento, Pesquisa, etc.)
   - Generates relevant tags (ChatGPT, Machine Learning, etc.)
   - Calculates reading time
4. **Database Insert**: Adds new articles to `noticias` table
5. **Logging**: Records results

### Articles Workflow
1. **Scheduled Run**: GitHub Action runs weekly on Sundays at 10 AM UTC
2. **RSS Parsing**: Fetches from both English and Portuguese sources
3. **Content Filtering**:
   - Only keeps AI-relevant articles
   - Validates content quality
   - Requires at least one AI-related tag
   - Extracts author information
4. **Smart Processing**:
   - Creates summaries (max 250 chars)
   - Auto-detects categories (Tutorial, Deep Learning, NLP, etc.)
   - Bilingual tag extraction
   - Calculates reading time
5. **Database Insert**: Adds new articles to `artigos` table

---

## 🛠️ Customization

### Change News Schedule

Edit `.github/workflows/fetch-news.yml`:
```yaml
schedule:
  - cron: '0 9 * * *'  # Current: Daily at 9 AM UTC
  # Examples:
  # - cron: '0 */12 * * *'  # Every 12 hours
  # - cron: '0 6,18 * * *'  # 6 AM and 6 PM UTC
```

### Change Articles Schedule

Edit `.github/workflows/fetch-articles.yml`:
```yaml
schedule:
  - cron: '0 10 * * 0'  # Current: Sundays at 10 AM UTC
  # Examples:
  # - cron: '0 10 * * 1,4'  # Mondays and Thursdays
  # - cron: '0 10 1,15 * *'  # 1st and 15th of month
```

### Add News Sources

Edit `scripts/fetch-news.js`:
```javascript
const RSS_FEEDS = [
  {
    url: 'https://your-site.com/rss',
    source: 'Your Site'
  },
  // ... add more
];
```

### Add Article Sources

Edit `scripts/fetch-articles.js`:
```javascript
const RSS_FEEDS = [
  {
    url: 'https://your-blog.com/feed',
    source: 'Your Blog',
    language: 'pt' // or 'en'
  },
  // ... add more
];
```

### Change Article Limits

In `fetch-news.js`, line ~256:
```javascript
for (const item of feedData.items.slice(0, 5)) { // Change 5 to desired number
```

In `fetch-articles.js`, line ~244:
```javascript
for (const item of feedData.items.slice(0, 10)) { // Change 10 to desired number
```

---

## 🧪 Testing Locally

### Test News Fetcher

```bash
cd scripts
npm install

# Windows PowerShell
$env:SUPABASE_URL="https://tdxxvweafelvgxoujpml.supabase.co"
$env:SUPABASE_SERVICE_KEY="your-service-key"
node fetch-news.js
```

### Test Articles Fetcher

```bash
cd scripts
npm install

# Windows PowerShell
$env:SUPABASE_URL="https://tdxxvweafelvgxoujpml.supabase.co"
$env:SUPABASE_SERVICE_KEY="your-service-key"
node fetch-articles.js
```

---

## 📊 Monitoring

- Check **Actions** tab in GitHub to see run history
- View log files in `.github/` directory
- Check Supabase Table Editor to verify imported content
- Review workflow run details for errors

---

## 🐛 Troubleshooting

### No articles imported
- Check if RSS feeds are accessible
- Verify articles aren't already in database
- Check GitHub Actions logs for errors
- Ensure content meets AI-relevance criteria

### Authentication errors
- Verify `SUPABASE_SERVICE_KEY` is the service_role key (not anon key)
- Confirm secrets are set correctly in repository settings
- Check Supabase URL is correct

### Duplicate articles
- Scripts check by link, so same link won't be imported twice
- If source changes URLs, duplicates may occur
- Manually delete duplicates from Supabase if needed

### Wrong categories or tags
- Adjust patterns in `detectCategory()` function
- Update keyword dictionaries in `extractTags()` function
- Test locally before pushing changes

---

## 💰 Cost

**Zero cost** for this automation:
- **GitHub Actions**: Free for public repos (unlimited), 500 min/month for private
- **Supabase Free Tier**: Includes database operations
- **RSS Feeds**: Free to read
- **npm Packages**: Free open-source

---

## 🔒 Security Notes

- ✅ Service key is stored as GitHub secret (encrypted)
- ✅ Service key never exposed in logs or code
- ✅ Workflows only run in your repository
- ⚠️ Don't commit `.env` files with keys
- ⚠️ Don't share service_role key publicly
- ⚠️ Keep your repository secrets secure

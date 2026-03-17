const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// RSS Feeds from major tech news sites focused on AI
const RSS_FEEDS = [
  {
    url: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
    source: 'TechCrunch',
    category: 'Tecnologia'
  },
  {
    url: 'https://venturebeat.com/category/ai/feed/',
    source: 'VentureBeat',
    category: 'Inteligência Artificial'
  },
  {
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    source: 'The Verge',
    category: 'Inovação'
  },
  {
    url: 'https://arstechnica.com/tag/artificial-intelligence/feed/',
    source: 'Ars Technica',
    category: 'Tecnologia'
  },
  {
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    source: 'WIRED',
    category: 'Inteligência Artificial'
  },
  {
    url: 'https://www.artificialintelligence-news.com/feed/',
    source: 'AI News',
    category: 'Lançamentos'
  }
];

// Initialize Supabase client with service key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize RSS parser
const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

// Extract clean text from HTML
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// Truncate text to specified length
function truncate(text, maxLength = 250) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Extract tags from content
function extractTags(title, content, feedSource) {
  const text = `${title} ${content}`.toLowerCase();
  const tags = [];
  
  const keywords = {
    'gpt': 'GPT',
    'chatgpt': 'ChatGPT',
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'claude': 'Claude',
    'gemini': 'Gemini',
    'llm': 'LLM',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'neural network': 'Neural Network',
    'transformer': 'Transformer',
    'generative': 'IA Generativa',
    'computer vision': 'Visão Computacional',
    'nlp': 'NLP'
  };
  
  for (const [keyword, tag] of Object.entries(keywords)) {
    if (text.includes(keyword)) {
      tags.push(tag);
    }
  }
  
  tags.push(feedSource);
  
  return [...new Set(tags)].slice(0, 5);
}

// Calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = stripHtml(content).split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

// Check if article already exists
async function articleExists(link) {
  const { data, error } = await supabase
    .from('noticias')
    .select('id')
    .eq('link', link)
    .single();
  
  return !!data;
}

// Fetch news from a single RSS feed
async function fetchFeedNews(feed) {
  try {
    console.log(`Fetching from ${feed.source}...`);
    const feedData = await parser.parseURL(feed.url);
    const articles = [];
    
    for (const item of feedData.items.slice(0, 5)) { // Get top 5 articles
      // Check if already exists
      if (await articleExists(item.link)) {
        console.log(`  ⏭️  Skipping existing: ${item.title}`);
        continue;
      }
      
      const content = item.contentSnippet || item.content || item.summary || '';
      const descricao = truncate(stripHtml(content));
      
      if (!descricao) continue; // Skip if no description
      
      const article = {
        titulo: item.title,
        descricao: descricao,
        data: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categoria: feed.category,
        link: item.link,
        tags: extractTags(item.title, content, feed.source),
        tempo_leitura: calculateReadingTime(content),
        trending: false
      };
      
      articles.push(article);
      console.log(`  ✅ ${item.title}`);
    }
    
    return articles;
  } catch (error) {
    console.error(`❌ Error fetching from ${feed.source}:`, error.message);
    return [];
  }
}

// Main function
async function main() {
  console.log('🚀 Starting AI news fetcher...\n');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }
  
  let allArticles = [];
  
  // Fetch from all feeds
  for (const feed of RSS_FEEDS) {
    const articles = await fetchFeedNews(feed);
    allArticles = allArticles.concat(articles);
  }
  
  console.log(`\n📊 Total new articles found: ${allArticles.length}`);
  
  if (allArticles.length === 0) {
    console.log('✨ No new articles to import.');
    return;
  }
  
  // Insert into Supabase
  console.log('\n💾 Inserting into Supabase...');
  const { data, error } = await supabase
    .from('noticias')
    .insert(allArticles);
  
  if (error) {
    console.error('❌ Error inserting articles:', error);
    throw error;
  }
  
  console.log(`✅ Successfully imported ${allArticles.length} new articles!`);
  console.log('\n🎉 Done!');
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

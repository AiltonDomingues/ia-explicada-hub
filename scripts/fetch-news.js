const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// RSS Feeds from major tech news sites focused on AI
const RSS_FEEDS = [
  {
    url: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
    source: 'TechCrunch'
  },
  {
    url: 'https://venturebeat.com/category/ai/feed/',
    source: 'VentureBeat'
  },
  {
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    source: 'The Verge'
  },
  {
    url: 'https://arstechnica.com/tag/artificial-intelligence/feed/',
    source: 'Ars Technica'
  },
  {
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    source: 'WIRED'
  },
  {
    url: 'https://www.artificialintelligence-news.com/feed/',
    source: 'AI News'
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
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Smart summarization - extract first complete sentences
function createSummary(text, maxLength = 200) {
  if (!text) return '';
  
  const cleanText = stripHtml(text).trim();
  
  // Try to get first complete sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return '';
  
  let summary = '';
  for (const sentence of sentences) {
    const nextSummary = summary ? `${summary}. ${sentence.trim()}` : sentence.trim();
    
    if (nextSummary.length <= maxLength) {
      summary = nextSummary;
    } else {
      break;
    }
  }
  
  // If we got at least one sentence, return it
  if (summary.length > 50) {
    return summary + '.';
  }
  
  // Otherwise truncate the first sentence
  if (sentences[0].length > maxLength) {
    return sentences[0].substring(0, maxLength).trim() + '...';
  }
  
  return sentences[0] + '.';
}

// Detect category based on content
function detectCategory(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  // Category patterns with priority (first match wins)
  const categories = [
    {
      pattern: /launch|release|unveil|announce|debut|introduces|launches|released/i,
      category: 'Lançamentos'
    },
    {
      pattern: /funding|investment|raised|valuation|acqui|ipo|billion|million.*raised/i,
      category: 'Investimento'
    },
    {
      pattern: /research|study|paper|breakthrough|discovery|scientist|university/i,
      category: 'Pesquisa'
    },
    {
      pattern: /regulation|policy|law|government|congress|senate|eu|privacy|gdpr/i,
      category: 'Regulação'
    },
    {
      pattern: /ethics|bias|safety|risk|danger|concern|controversy|害/i,
      category: 'Ética'
    },
    {
      pattern: /robot|autonomous|self-driving|drone|hardware|chip|processor/i,
      category: 'Robótica'
    },
    {
      pattern: /startup|company|business|enterprise|corporate|google|microsoft|meta|apple/i,
      category: 'Empresas'
    },
    {
      pattern: /gpt|chatgpt|claude|gemini|llm|language model|generative/i,
      category: 'Inteligência Artificial'
    },
    {
      pattern: /machine learning|deep learning|neural network|algorithm|model|training/i,
      category: 'Machine Learning'
    },
    {
      pattern: /image|video|art|creative|design|midjourney|dall-e|stable diffusion/i,
      category: 'IA Criativa'
    },
    {
      pattern: /developer|code|programming|api|tool|framework|sdk/i,
      category: 'Ferramentas'
    }
  ];
  
  for (const { pattern, category } of categories) {
    if (pattern.test(text)) {
      return category;
    }
  }
  
  // Default fallback
  return 'Tecnologia';
}

// Extract intelligent tags from content
function extractTags(title, content, feedSource) {
  const text = `${title} ${content}`.toLowerCase();
  const tags = [];
  
  // AI Models & Companies
  const aiKeywords = {
    'gpt-4|gpt-5|gpt': 'GPT',
    'chatgpt|chat gpt': 'ChatGPT',
    'openai|open ai': 'OpenAI',
    'anthropic': 'Anthropic',
    'claude': 'Claude',
    'gemini|bard': 'Gemini',
    'meta ai|llama': 'Meta AI',
    'mistral': 'Mistral',
    'cohere': 'Cohere',
    'midjourney': 'Midjourney',
    'stable diffusion|stability ai': 'Stable Diffusion',
    'dall-e|dalle': 'DALL-E',
    'sora': 'Sora'
  };
  
  // Technologies & Concepts
  const techKeywords = {
    'llm|large language model': 'LLM',
    'machine learning|ml': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'neural network': 'Neural Networks',
    'transformer': 'Transformers',
    'generative ai|gen ai': 'IA Generativa',
    'computer vision': 'Visão Computacional',
    'nlp|natural language': 'NLP',
    'multimodal': 'Multimodal',
    'agi|artificial general': 'AGI',
    'reinforcement learning': 'RL',
    'robotics|robot': 'Robótica',
    'autonomous': 'Autônomo'
  };
  
  // Actions & Events
  const actionKeywords = {
    'launch|release|unveil|announce|debut': 'Lançamento',
    'funding|investment|raised|valuation': 'Investimento',
    'partnership|partner|collaboration': 'Parcerias',
    'research|study|paper': 'Pesquisa',
    'regulation|policy|law': 'Regulação',
    'ethics|bias|safety': 'Ética'
  };
  
  const allKeywords = { ...aiKeywords, ...techKeywords, ...actionKeywords };
  
  for (const [pattern, tag] of Object.entries(allKeywords)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(text)) {
      tags.push(tag);
    }
  }
  
  // Always add source as tag
  tags.push(feedSource);
  
  // Remove duplicates and limit to 6 tags
  return [...new Set(tags)].slice(0, 6);
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
        console.log(`  [SKIP] Article exists: ${item.title}`);
        continue;
      }
      
      const content = item.contentSnippet || item.content || item.summary || '';
      const descricao = createSummary(content, 200);
      
      if (!descricao || descricao.length < 30) continue; // Skip if no proper description
      
      const article = {
        titulo: item.title,
        descricao: descricao,
        data: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categoria: detectCategory(item.title, content),
        link: item.link,
        tags: extractTags(item.title, content, feed.source),
        tempo_leitura: calculateReadingTime(content),
        trending: false
      };
      
      articles.push(article);
      console.log(`  [NEW] ${item.title}`);
    }
    
    return articles;
  } catch (error) {
    console.error(`[ERROR] Failed to fetch from ${feed.source}:`, error.message);
    return [];
  }
}

// Main function
async function main() {
  console.log('[STARTUP] AI News Fetcher started\n');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }
  
  let allArticles = [];
  
  // Fetch from all feeds
  for (const feed of RSS_FEEDS) {
    const articles = await fetchFeedNews(feed);
    allArticles = allArticles.concat(articles);
  }
  
  console.log(`\n[SUMMARY] Total new articles found: ${allArticles.length}`);
  
  if (allArticles.length === 0) {
    console.log('[COMPLETE] No new articles to import.');
    return;
  }
  
  // Insert into Supabase
  console.log('\n[DB] Inserting articles into Supabase...');
  const { data, error } = await supabase
    .from('noticias')
    .insert(allArticles);
  
  if (error) {
    console.error('[DB] Error inserting articles:', error);
    throw error;
  }
  
  console.log(`[DB] Successfully imported ${allArticles.length} new articles`);
  console.log('\n[COMPLETE] News fetch completed');
}

// Run
main().catch(error => {
  console.error('[FATAL] Fatal error:', error);
  process.exit(1);
});

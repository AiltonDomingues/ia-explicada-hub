const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// RSS Feeds from Brazilian AI-focused news sites
const RSS_FEEDS = [
  {
    url: 'https://ainews.net.br/feed/',
    source: 'AI News Brasil'
  },
  {
    url: 'https://iabrasilnoticias.com.br/feed/',
    source: 'IA Brasil Notícias'
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

// Detect category based on content (Portuguese + English keywords)
function detectCategory(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  // Category patterns with priority (most specific first)
  const categories = [
    // Specific technical categories first
    {
      pattern: /gpt|chatgpt|claude|gemini|llm|modelo de linguagem|generativa|generativo|language model|generative ai|ia generativa/i,
      category: 'IA Generativa'
    },
    {
      pattern: /aprendizado de máquina|aprendizado profundo|rede neural|algoritmo de ia|treinamento de modelo|machine learning|deep learning|neural network|model training/i,
      category: 'Machine Learning'
    },
    {
      pattern: /visão computacional|reconhecimento facial|processamento de imagem|computer vision|image recognition|facial recognition/i,
      category: 'Visão Computacional'
    },
    {
      pattern: /robô|robótica|autônomo|autônoma|drone|veículo autônomo|robot|robotics|autonomous|self-driving/i,
      category: 'Robótica'
    },
    {
      pattern: /(pesquisa|estudo|científico|descoberta|universidade|artigo científico|research|study|paper|breakthrough|discovery|scientist).{0,100}(ia|ai|inteligência artificial|artificial intelligence)/i,
      category: 'Pesquisa'
    },
    {
      pattern: /regulação|regulamenta|lei sobre ia|governo.*ia|congresso|senado|lgpd|regulation.*ai|policy|law.*ai|government.*ai|privacy.*ai|gdpr/i,
      category: 'Regulação'
    },
    {
      pattern: /(ética|ético|viés|segurança da ia|risco.*ia|perigo.*ia|preocupação.*ia|controvérsia.*ia|ethics|bias|ai safety|ai risk|ai danger|ai concern).{0,100}(ia|ai|inteligência artificial)/i,
      category: 'Ética & Segurança'
    },
    {
      pattern: /investimento em ia|investiu.*ia|capta.*startup|rodada.*investimento|financiamento.*ia|aporte|valuation|funding.*ai|investment.*ai|raised.*startup/i,
      category: 'Investimento'
    },
    // Product launches - more specific, requires product/service context
    {
      pattern: /(lança|lançou|anuncia|anunciou|apresenta|apresentou|divulga|launch|release|unveil|announce|debut).{0,50}(nova ia|novo modelo|nova ferramenta|novo recurso|novo produto|nova versão|new ai|new model|new tool|new feature|new product|new version)/i,
      category: 'Lançamentos'
    },
    {
      pattern: /(startup|empresa de ia|gigante tech|google|microsoft|meta|openai|anthropic|apple|amazon|nvidia).{0,100}(ia|ai|inteligência artificial)/i,
      category: 'Empresas & Startups'
    },
    {
      pattern: /desenvolvedor|código.*ia|programação.*ia|api.*ia|ferramenta.*dev|framework.*ia|sdk|biblioteca|developer|code.*ai|programming.*ai|ai api|ai tool/i,
      category: 'Ferramentas & Dev'
    },
    {
      pattern: /imagem.*ia|vídeo.*ia|arte.*ia|criativa|criativo|design.*ia|geração.*imagem|midjourney|dall-e|stable diffusion|ai art|ai image|ai video|ai creative/i,
      category: 'IA Criativa'
    },
    // General tech/society news about AI
    {
      pattern: /tribunal.*ia|confiscado|proibido|banido|polêmica|escândalo|fraude|trapaça|crime|court.*ai|banned|prohibited|controversy|scandal|fraud/i,
      category: 'Tecnologia & Sociedade'
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
  
  // Technologies & Concepts (Portuguese + English)
  const techKeywords = {
    'llm|large language model|modelo de linguagem': 'LLM',
    'machine learning|ml|aprendizado de máquina': 'Machine Learning',
    'deep learning|aprendizado profundo': 'Deep Learning',
    'neural network|rede neural|redes neurais': 'Neural Networks',
    'transformer': 'Transformers',
    'generative ai|gen ai|ia generativa|generativa': 'IA Generativa',
    'computer vision|visão computacional': 'Visão Computacional',
    'nlp|natural language|processamento de linguagem': 'NLP',
    'multimodal': 'Multimodal',
    'agi|artificial general|inteligência artificial geral': 'AGI',
    'reinforcement learning|aprendizado por reforço': 'RL',
    'robotics|robot|robótica|robô': 'Robótica',
    'autonomous|autônomo|autônoma': 'Autônomo'
  };
  
  // Actions & Events (Portuguese + English)
  const actionKeywords = {
    'launch|release|lançamento|lança|apresenta': 'Lançamento',
    'funding|investment|investimento|aporte|capta': 'Investimento',
    'partnership|parceria|colaboração|collaboration': 'Parcerias',
    'research|study|pesquisa|estudo': 'Pesquisa',
    'regulation|policy|regulação|lei|regulamenta': 'Regulação',
    'ethics|bias|safety|ética|viés|segurança': 'Ética'
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

// Check if content is AI-relevant (skip for AI-specific sources)
function isAIRelevant(title, content, source) {
  // AI-specific news sources - all articles are relevant
  const aiSpecificSources = ['AI News Brasil', 'IA Brasil Notícias'];
  if (aiSpecificSources.includes(source)) {
    return true; // All articles from AI-specific sources are relevant
  }
  
  const text = `${title} ${content}`.toLowerCase();
  
  // AI/ML terms that should be present (for general tech sources)
  const aiTerms = [
    // Core AI terms
    'inteligência artificial', 'artificial intelligence', 'ia generativa',
    'machine learning', 'aprendizado de máquina', 'ml',
    'deep learning', 'aprendizado profundo',
    'neural network', 'rede neural', 'redes neurais',
    // AI models/technologies
    'gpt', 'chatgpt', 'claude', 'gemini', 'llm', 'gpt-4', 'gpt-5',
    'modelo de linguagem', 'language model',
    'transformer', 'bert', 'stable diffusion', 'midjourney', 'dall-e',
    // AI domains
    'computer vision', 'visão computacional',
    'nlp', 'processamento de linguagem natural', 'natural language processing',
    'data science', 'ciência de dados',
    'robótica', 'robotics', 'robô',
    // Technical terms
    'algoritmo de ia', 'ai algorithm', 'modelo de ia', 'ai model',
    'treinamento de modelo', 'model training', 'fine-tuning',
    'inference', 'inferência',
    // Companies/platforms
    'openai', 'anthropic', 'google ai', 'deepmind', 'nvidia ai',
    // Applications
    'ia criativa', 'generative ai', 'ai generativa',
    'automação inteligente', 'intelligent automation',
    'assistente virtual', 'virtual assistant', 'chatbot'
  ];
  
  return aiTerms.some(term => text.includes(term));
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
      
      // Filter for AI-relevant content
      if (!isAIRelevant(item.title, content, feed.source)) {
        console.log(`  [SKIP] Not AI-relevant: ${item.title}`);
        continue;
      }
      
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

// Clean old news (older than 2 days)
async function cleanOldNews() {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const cutoffDate = twoDaysAgo.toISOString().split('T')[0];
    
    console.log(`[CLEANUP] Deleting news older than ${cutoffDate}...`);
    
    const { data, error } = await supabase
      .from('noticias')
      .delete()
      .lt('data', cutoffDate);
    
    if (error) {
      console.error('[CLEANUP] Error deleting old news:', error);
    } else {
      console.log('[CLEANUP] Old news deleted successfully');
    }
  } catch (error) {
    console.error('[CLEANUP] Failed to clean old news:', error.message);
  }
}

// Main function
async function main() {
  console.log('[STARTUP] AI News Fetcher started\n');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }
  
  // Clean old news first
  await cleanOldNews();
  console.log('');
  
  let allArticles = [];
  
  // Fetch from all feeds
  for (const feed of RSS_FEEDS) {
    const articles = await fetchFeedNews(feed);
    allArticles = allArticles.concat(articles);
  }
  
  console.log(`\n[SUMMARY] Total new articles found: ${allArticles.length}`);
  
  if (allArticles.length === 0) {
    console.log('[COMPLETE] No new articles to import.');
    process.exit(0);
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
  process.exit(0);
}

// Run
main().catch(error => {
  console.error('[FATAL] Fatal error:', error);
  process.exit(1);
});

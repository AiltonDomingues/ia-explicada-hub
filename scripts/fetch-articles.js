const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// RSS Feeds for in-depth AI articles (English + Portuguese)
const RSS_FEEDS = [
  {
    url: 'https://medium.com/feed/towards-data-science',
    source: 'Towards Data Science',
    language: 'en'
  },
  {
    url: 'https://medium.com/feed/tag/artificial-intelligence',
    source: 'Medium AI',
    language: 'en'
  },
  {
    url: 'https://dev.to/feed/tag/ai',
    source: 'Dev.to',
    language: 'en'
  },
  {
    url: 'https://tecnoblog.net/feed/',
    source: 'Tecnoblog',
    language: 'pt'
  },
  {
    url: 'https://www.alura.com.br/artigos/feed.xml',
    source: 'Alura',
    language: 'pt'
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
      ['dc:creator', 'creator'],
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
function createSummary(text, maxLength = 250) {
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

// Detect category based on content (Portuguese + English)
function detectCategory(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  // Category patterns with priority (first match wins)
  const categories = [
    {
      pattern: /tutorial|how to|guide|como fazer|passo a passo|aprenda|learn/i,
      category: 'Tutorial'
    },
    {
      pattern: /deep learning|aprendizado profundo|neural network|rede neural/i,
      category: 'Deep Learning'
    },
    {
      pattern: /nlp|processamento de linguagem|natural language|chatbot|gpt|llm/i,
      category: 'NLP'
    },
    {
      pattern: /computer vision|visão computacional|image|imagem|reconhecimento|recognition/i,
      category: 'Visão Computacional'
    },
    {
      pattern: /machine learning|aprendizado de máquina|algoritmo|algorithm|modelo|model/i,
      category: 'Machine Learning'
    },
    {
      pattern: /ética|ethics|viés|bias|responsável|responsible|fair/i,
      category: 'Ética'
    },
    {
      pattern: /python|tensorflow|pytorch|keras|scikit/i,
      category: 'Programação'
    },
    {
      pattern: /data science|ciência de dados|análise|analysis/i,
      category: 'Ciência de Dados'
    },
    {
      pattern: /robotics|robótica|robô|autonomous|autônomo/i,
      category: 'Robótica'
    },
    {
      pattern: /business|negócio|enterprise|empresarial/i,
      category: 'Aplicações'
    }
  ];
  
  for (const { pattern, category } of categories) {
    if (pattern.test(text)) {
      return category;
    }
  }
  
  // Default fallback
  return 'Inteligência Artificial';
}

// Extract intelligent tags from content
function extractTags(title, content) {
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
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'hugging face|huggingface': 'Hugging Face'
  };
  
  // Technologies & Concepts (Portuguese + English)
  const techKeywords = {
    'llm|large language model|modelo de linguagem': 'LLM',
    'machine learning|ml|aprendizado de máquina': 'Machine Learning',
    'deep learning|aprendizado profundo': 'Deep Learning',
    'neural network|rede neural|redes neurais': 'Redes Neurais',
    'transformer': 'Transformers',
    'generative ai|gen ai|ia generativa|generativa': 'IA Generativa',
    'computer vision|visão computacional': 'Visão Computacional',
    'nlp|natural language|processamento de linguagem': 'NLP',
    'reinforcement learning|aprendizado por reforço': 'RL',
    'supervised|supervisionado': 'Supervisionado',
    'unsupervised|não supervisionado': 'Não Supervisionado',
    'classification|classificação': 'Classificação',
    'regression|regressão': 'Regressão',
    'clustering|agrupamento': 'Clustering',
    'python': 'Python',
    'dataset|conjunto de dados': 'Dataset'
  };
  
  const allKeywords = { ...aiKeywords, ...techKeywords };
  
  for (const [pattern, tag] of Object.entries(allKeywords)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(text)) {
      tags.push(tag);
    }
  }
  
  // Remove duplicates and limit to 6 tags
  return [...new Set(tags)].slice(0, 6);
}

// Calculate reading time based on content length
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = stripHtml(content).split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${Math.max(minutes, 1)} min`;
}

// Extract author name
function extractAuthor(item) {
  return item.creator || item['dc:creator'] || item.author || 'Autor Desconhecido';
}

// Check if article already exists
async function articleExists(link) {
  const { data, error } = await supabase
    .from('artigos')
    .select('id')
    .eq('link', link)
    .single();
  
  return !!data;
}

// Filter for AI-relevant content
function isAIRelevant(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  const aiTerms = [
    'artificial intelligence', 'inteligência artificial',
    'machine learning', 'aprendizado de máquina',
    'deep learning', 'aprendizado profundo',
    'neural network', 'rede neural',
    'gpt', 'chatgpt', 'llm',
    'computer vision', 'visão computacional',
    'nlp', 'processamento de linguagem',
    'data science', 'ciência de dados',
    'algoritmo', 'algorithm',
    'modelo', 'model',
    'treinamento', 'training'
  ];
  
  return aiTerms.some(term => text.includes(term));
}

// Fetch articles from a single RSS feed
async function fetchFeedArticles(feed) {
  try {
    console.log(`[FETCH] Fetching from ${feed.source}...`);
    const feedData = await parser.parseURL(feed.url);
    const articles = [];
    
    for (const item of feedData.items.slice(0, 10)) { // Get top 10 articles
      // Check if already exists
      if (await articleExists(item.link)) {
        console.log(`  [SKIP] Article exists: ${item.title}`);
        continue;
      }
      
      const content = item.contentSnippet || item.content || item.summary || '';
      
      // Filter for AI-relevant content
      if (!isAIRelevant(item.title, content)) {
        console.log(`  [SKIP] Not AI-relevant: ${item.title}`);
        continue;
      }
      
      const descricao = createSummary(content, 250);
      
      if (!descricao || descricao.length < 50) {
        console.log(`  [SKIP] No proper description: ${item.title}`);
        continue;
      }
      
      const tags = extractTags(item.title, content);
      
      // Must have at least one tag to be relevant
      if (tags.length === 0) {
        console.log(`  [SKIP] No relevant tags: ${item.title}`);
        continue;
      }
      
      const article = {
        titulo: item.title,
        autor: extractAuthor(item),
        descricao: descricao,
        categoria: detectCategory(item.title, content),
        data: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tags: tags,
        tempo_leitura: calculateReadingTime(content),
        link: item.link,
        destaque: false
      };
      
      articles.push(article);
      console.log(`  [NEW] ${item.title} | Tags: ${tags.join(', ')}`);
    }
    
    return articles;
  } catch (error) {
    console.error(`[ERROR] Failed to fetch from ${feed.source}:`, error.message);
    return [];
  }
}

// Main function
async function main() {
  console.log('[STARTUP] AI Articles Fetcher started\n');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }
  
  let allArticles = [];
  
  // Fetch from all feeds
  for (const feed of RSS_FEEDS) {
    const articles = await fetchFeedArticles(feed);
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
    .from('artigos')
    .insert(allArticles);
  
  if (error) {
    console.error('[DB] Error inserting articles:', error);
    throw error;
  }
  
  console.log(`[DB] Successfully imported ${allArticles.length} new articles`);
  console.log('\n[COMPLETE] Articles fetch completed');
}

// Run
main().catch(error => {
  console.error('[FATAL] Fatal error:', error);
  process.exit(1);
});

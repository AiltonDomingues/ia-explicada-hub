const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Semantic Scholar API config
const SS_API_BASE = 'https://api.semanticscholar.org/graph/v1';
const SS_FIELDS = 'title,abstract,year,authors,url,publicationDate,citationCount,openAccessPdf';

const MIN_YEAR = new Date().getFullYear() - 5; // articles from last 5 years
const MAX_ARTICLES = 30;

const SEARCH_TOPICS = [
  { query: 'AI', label: 'IA', categoria: 'Inteligência Artificial', limit: 15 },
  { query: 'Machine Learning', label: 'ML', categoria: 'Machine Learning', limit: 15 }
];

// Initialize Supabase client with service key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// HTTP GET helper (returns parsed JSON)
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const headers = { 'User-Agent': 'ia-explicada-hub/1.0', 'Accept': 'application/json' };
    if (process.env.SS_API_KEY) headers['x-api-key'] = process.env.SS_API_KEY;
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error(`JSON parse failed: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

// HTTP GET with retry on 429 (exponential backoff)
async function httpGetWithRetry(url, maxRetries = 5) {
  let delay = 10000; // start at 10s
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { status, body } = await httpGet(url);
    if (status === 200) return body;
    if (status === 429) {
      console.log(`[API] Rate limited (429). Waiting ${delay / 1000}s before retry ${attempt}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2; // double the wait each time
    } else {
      throw new Error(`Unexpected status ${status}: ${JSON.stringify(body).substring(0, 200)}`);
    }
  }
  throw new Error('Max retries reached after 429 responses');
}

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
  
  // Category patterns with priority (most specific first)
  const categories = [
    // Educational content
    {
      pattern: /tutorial|how to|guide|guia|como fazer|passo a passo|aprenda|learn|walkthrough|hands-on/i,
      category: 'Tutorial'
    },
    // Specific AI domains
    {
      pattern: /nlp|processamento de linguagem|natural language|chatbot|conversational|gpt|llm|modelo de linguagem|language model|transformer/i,
      category: 'NLP & LLMs'
    },
    {
      pattern: /computer vision|visão computacional|image recognition|reconhecimento de imagem|object detection|detecção de objeto|segmentation|segmentação/i,
      category: 'Visão Computacional'
    },
    {
      pattern: /deep learning|aprendizado profundo|neural network|rede neural|convolutional|recurrent|lstm|gru|attention/i,
      category: 'Deep Learning'
    },
    {
      pattern: /reinforcement learning|aprendizado por reforço|q-learning|policy gradient|reward|agent learning/i,
      category: 'Aprendizado por Reforço'
    },
    {
      pattern: /generative ai|ia generativa|gan|vae|diffusion model|modelo generativo|stable diffusion|midjourney|dall-e/i,
      category: 'IA Generativa'
    },
    // Core ML topics
    {
      pattern: /machine learning|aprendizado de máquina|supervised learning|unsupervised|classification|regression|clustering/i,
      category: 'Machine Learning'
    },
    {
      pattern: /ética em ia|ai ethics|viés|bias|fairness|justiça|responsible ai|ia responsável|explicabilidade|explainability|interpretability/i,
      category: 'Ética & IA Responsável'
    },
    // Technical implementation
    {
      pattern: /python.*ml|tensorflow|pytorch|keras|scikit-learn|hugging face|jax|implementation|implementação/i,
      category: 'Programação & Frameworks'
    },
    {
      pattern: /data science|ciência de dados|análise de dados|data analysis|feature engineering|data preparation/i,
      category: 'Ciência de Dados'
    },
    {
      pattern: /mlops|model deployment|produção|production|serving|inference|otimização de modelo|model optimization/i,
      category: 'MLOps & Produção'
    },
    // Application domains
    {
      pattern: /robotics|robótica|robô|autonomous system|sistema autônomo|drone|manipulation|navegação autônoma/i,
      category: 'Robótica'
    },
    {
      pattern: /healthcare|saúde|medical ai|diagnóstico|medical imaging|drug discovery|descoberta de drogas/i,
      category: 'IA na Saúde'
    },
    {
      pattern: /business|negócio|enterprise|empresarial|aplicação comercial|commercial application|industry/i,
      category: 'Aplicações Empresariais'
    },
    // Research
    {
      pattern: /research paper|artigo científico|paper review|análise de paper|pesquisa|estudo|experiment|experimento/i,
      category: 'Pesquisa'
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

// Translate text from English to Portuguese via MyMemory free API
async function translateToPortuguese(text) {
  if (!text) return '';
  // Truncate to 500 chars to stay well within MyMemory free tier (5000 chars/day)
  const truncated = text.substring(0, 500);
  const encoded = encodeURIComponent(truncated);
  const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|pt-BR`;
  try {
    const { body } = await httpGet(url);
    if (body.responseStatus === 200 && body.responseData && body.responseData.translatedText) {
      return body.responseData.translatedText;
    }
  } catch (e) {
    console.error(`[TRANSLATE] Error translating: ${e.message}`);
  }
  return truncated; // fallback: return original
}

// Extract intelligent tags from content
function extractTags(title, content, fallbackCategory) {
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

  // Technologies & Concepts
  const techKeywords = {
    'llm|large language model': 'LLM',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'neural network|neural net': 'Redes Neurais',
    'transformer': 'Transformers',
    'generative|diffusion|gan|vae': 'IA Generativa',
    'computer vision|image recognition|object detection': 'Visão Computacional',
    'natural language|\bnlp\b|text classification|sentiment': 'NLP',
    'reinforcement learning': 'RL',
    'classification|classifier': 'Classificação',
    'regression': 'Regressão',
    'clustering|cluster': 'Clustering',
    'optimization|gradient|loss function': 'Otimização',
    'prediction|forecasting|forecast': 'Predição',
    'algorithm|algoritmo': 'Algoritmos',
    'dataset|benchmark|training data': 'Dataset',
    'python|pytorch|keras|scikit': 'Python',
    'healthcare|medical|clinical|diagnosis': 'IA na Saúde',
    'robotic|autonomous|drone': 'Robótica',
    'ethics|bias|fairness|explainab': 'Ética em IA',
    'artificial intelligence|\bai\b': 'Inteligência Artificial'
  };

  const allKeywords = { ...aiKeywords, ...techKeywords };

  for (const [pattern, tag] of Object.entries(allKeywords)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(text)) {
      tags.push(tag);
    }
  }

  const unique = [...new Set(tags)].slice(0, 6);

  // Fallback: if no tags found, use the topic category as base tag
  if (unique.length === 0 && fallbackCategory) {
    return [fallbackCategory];
  }

  return unique;
}

// Extract author names from Semantic Scholar authors array
function extractAuthor(authors) {
  if (!authors || authors.length === 0) return 'Autores Desconhecidos';
  return authors.slice(0, 3).map(a => a.name).join(', ') + (authors.length > 3 ? ' et al.' : '');
}

// Check if article already exists by link
async function articleExists(link) {
  const { data, error } = await supabase
    .from('artigos')
    .select('id')
    .eq('link', link)
    .single();
  
  return !!data;
}

// Fetch papers from Semantic Scholar API for a given topic
async function fetchSemanticScholarPapers(topic) {
  const { query, label, categoria, limit } = topic;
  const encodedQuery = encodeURIComponent(query);
  // sort=relevance matches https://www.semanticscholar.org/search?sort=relevance
  // Fetch 5x the limit so we have enough candidates after year/abstract filtering
  const url = `${SS_API_BASE}/paper/search?query=${encodedQuery}&fields=${SS_FIELDS}&sort=relevance&limit=${limit * 5}`;

  console.log(`[FETCH] Searching Semantic Scholar: "${query}"...`);

  const result = await httpGetWithRetry(url);

  if (!result.data || result.data.length === 0) {
    console.error(`[ERROR] No results from Semantic Scholar for "${query}" | API response: ${JSON.stringify(result).substring(0, 200)}`);
    return [];
  }

  // Filter: must have abstract, be within last 5 years
  const filtered = result.data.filter(paper =>
    paper.year && paper.year >= MIN_YEAR &&
    paper.abstract && paper.abstract.length >= 100 &&
    paper.title
  );

  // API already returns by relevance; preserve that order
  console.log(`[FETCH] ${result.data.length} results -> ${filtered.length} from last 5 years with abstracts`);

  const candidates = filtered.slice(0, limit);

  // Translate abstracts sequentially to avoid rate limiting
  const articles = [];
  for (const paper of candidates) {
    const abstract = paper.abstract || '';
    const link = paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`;
    const words = abstract.split(/\s+/).length;
    const readingMinutes = Math.max(3, Math.ceil(words / 200));

    console.log(`  [TRANSLATE] ${paper.title.substring(0, 60)}...`);
    const resumoPt = await translateToPortuguese(createSummary(abstract, 500) || abstract.substring(0, 500));

    articles.push({
      titulo: paper.title,
      autor: extractAuthor(paper.authors),
      resumo: resumoPt,
      categoria,
      data: paper.publicationDate || `${paper.year}-01-01`,
      tags: extractTags(paper.title, abstract, categoria),
      tempo_leitura: `${readingMinutes} min`,
      link,
      destaque: (paper.citationCount || 0) > 1000
    });

    // Small delay to respect MyMemory rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  return articles;
}

// Delete the N oldest articles to enforce the MAX_ARTICLES limit
async function enforceArticleLimit(newCount) {
  const { count } = await supabase
    .from('artigos')
    .select('*', { count: 'exact', head: true });

  const currentCount = count || 0;
  const afterInsert = currentCount + newCount;

  console.log(`[LIMIT] Current: ${currentCount} | New: ${newCount} | After: ${afterInsert} | Max: ${MAX_ARTICLES}`);

  if (afterInsert <= MAX_ARTICLES) return;

  const toDelete = afterInsert - MAX_ARTICLES;
  console.log(`[CLEANUP] Deleting ${toDelete} oldest article(s)...`);

  const { data: oldest } = await supabase
    .from('artigos')
    .select('id')
    .order('data', { ascending: true })
    .limit(toDelete);

  if (!oldest || oldest.length === 0) return;

  const ids = oldest.map(a => a.id);
  const { error } = await supabase.from('artigos').delete().in('id', ids);

  if (error) {
    console.error('[CLEANUP] Error deleting old articles:', error);
  } else {
    console.log(`[CLEANUP] Deleted ${ids.length} articles`);
  }
}
// Main function
async function main() {
  console.log('[STARTUP] Semantic Scholar Articles Fetcher started');
  console.log(`[CONFIG] Min year: ${MIN_YEAR} | Max articles: ${MAX_ARTICLES} | Topics: ${SEARCH_TOPICS.map(t => t.label).join(', ')}\n`);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }

  let allNewArticles = [];

  for (const topic of SEARCH_TOPICS) {
    const papers = await fetchSemanticScholarPapers(topic);

    // Deduplicate against existing DB entries
    const newPapers = [];
    for (const paper of papers) {
      if (await articleExists(paper.link)) {
        console.log(`  [SKIP] Already in DB: ${paper.titulo}`);
      } else {
        newPapers.push(paper);
        console.log(`  [NEW] ${paper.titulo} (${paper.data}) | Citations: ${paper.destaque ? '100+' : '<100'}`);
      }
    }

    console.log(`[TOPIC] ${topic.label}: ${newPapers.length} new articles\n`);
    allNewArticles = allNewArticles.concat(newPapers);

    // Rate limit between API calls
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`[SUMMARY] Total new articles: ${allNewArticles.length}`);

  if (allNewArticles.length === 0) {
    console.log('[COMPLETE] No new articles to import.');
    process.exit(0);
  }

  // Enforce 30-article limit: delete oldest if needed before inserting
  await enforceArticleLimit(allNewArticles.length);

  // Insert into Supabase
  console.log('\n[DB] Inserting articles into Supabase...');
  const { error } = await supabase.from('artigos').insert(allNewArticles);

  if (error) {
    console.error('[DB] Error inserting articles:', error);
    throw error;
  }

  console.log(`[DB] Successfully imported ${allNewArticles.length} articles`);
  console.log('[COMPLETE] Done');
  process.exit(0);
}

// Run
main().catch(error => {
  console.error('[FATAL] Fatal error:', error);
  process.exit(1);
});

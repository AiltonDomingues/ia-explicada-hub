const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Semantic Scholar API config
const SS_API_BASE = 'https://api.semanticscholar.org/graph/v1';
const SS_FIELDS = 'title,abstract,year,authors,url,publicationDate,citationCount,openAccessPdf';

const MIN_YEAR = new Date().getFullYear() - 5; // articles from last 5 years
const MAX_ARTICLES = 30;

const SEARCH_TOPICS = [
  { query: 'artificial intelligence', label: 'IA', categoria: 'Inteligência Artificial', limit: 15 },
  { query: 'machine learning', label: 'ML', categoria: 'Machine Learning', limit: 15 }
];

// Initialize Supabase client with service key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// HTTP GET helper (returns parsed JSON)
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ia-explicada-hub/1.0', 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse failed: ${e.message}`)); }
      });
    }).on('error', reject);
  });
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
  // Fetch 3x the limit to have enough after year filtering; sort by citation count for relevance
  const url = `${SS_API_BASE}/paper/search?query=${encodedQuery}&fields=${SS_FIELDS}&limit=${limit * 3}&sort=citationCount:desc`;

  console.log(`[FETCH] Searching Semantic Scholar: "${query}"...`);

  const result = await httpGet(url);

  if (!result.data || result.data.length === 0) {
    console.error(`[ERROR] No results from Semantic Scholar for "${query}"`);
    return [];
  }

  // Filter: must have abstract, be within last 5 years
  const filtered = result.data.filter(paper =>
    paper.year && paper.year >= MIN_YEAR &&
    paper.abstract && paper.abstract.length >= 100 &&
    paper.title
  );

  console.log(`[FETCH] ${result.data.length} results -> ${filtered.length} from last 5 years with abstracts`);

  return filtered.slice(0, limit).map(paper => {
    const abstract = paper.abstract || '';
    const link = paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`;
    const words = abstract.split(/\s+/).length;
    const readingMinutes = Math.max(3, Math.ceil(words / 200));

    return {
      titulo: paper.title,
      autor: extractAuthor(paper.authors),
      resumo: createSummary(abstract, 300) || abstract.substring(0, 300),
      categoria,
      data: paper.publicationDate || `${paper.year}-01-01`,
      tags: extractTags(paper.title, abstract),
      tempo_leitura: `${readingMinutes} min`,
      link,
      destaque: (paper.citationCount || 0) > 100
    };
  });
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

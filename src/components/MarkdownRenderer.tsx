import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import MermaidRenderer from './MermaidRenderer';
import PlotRenderer from './PlotRenderer';
import HeatmapRenderer from './HeatmapRenderer';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  // Função para remover strings "undefined" de children
  const cleanUndefined = (children: any) => {
    if (!children) return children;
    if (Array.isArray(children)) {
      return children.filter(child => 
        !(typeof child === 'string' && child.trim() === 'undefined')
      );
    }
    if (typeof children === 'string' && children.trim() === 'undefined') {
      return null;
    }
    return children;
  };

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { 
            strict: false,
            throwOnError: false,
            errorColor: '#cc0000',
            trust: true
          }],
          rehypeHighlight
        ]}
        components={{
          // Customizar renderização de elementos específicos
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">
              {cleanUndefined(children)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3">
              {cleanUndefined(children)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
              {cleanUndefined(children)}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {cleanUndefined(children)}
            </p>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            // Renderizar diagramas Mermaid
            if (language === 'mermaid') {
              return <MermaidRenderer chart={codeContent} />;
            }

            // Renderizar gráficos com Plot
            if (language === 'plot' || language === 'chart') {
              return <PlotRenderer config={codeContent} />;
            }

            // Renderizar heatmaps
            if (language === 'heatmap') {
              return <HeatmapRenderer config={codeContent} />;
            }

            // Código normal com syntax highlighting
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 border border-border">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props}>{cleanUndefined(children)}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cleanUndefined(children)}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-lg max-w-full h-auto my-4 border border-border"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {cleanUndefined(children)}
            </td>
          ),
          strong: ({ children }) => <strong>{cleanUndefined(children)}</strong>,
          em: ({ children }) => <em>{cleanUndefined(children)}</em>,
          div: ({ children, ...props }: any) => <div {...props}>{cleanUndefined(children)}</div>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

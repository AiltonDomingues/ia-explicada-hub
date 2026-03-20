import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  // Função auxiliar para filtrar apenas "undefined" strings
  const filterChildren = (children: any) => {
    if (!children) return children;
    
    if (Array.isArray(children)) {
      return children.filter((c) => {
        // Remove apenas strings "undefined" - mantém todo o resto
        if (typeof c === 'string' && c.trim() === 'undefined') return false;
        return true;
      });
    }
    
    // Remove apenas strings "undefined" 
    if (typeof children === 'string' && children.trim() === 'undefined') return null;
    return children;
  };

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Customizar renderização de elementos específicos
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">
              {filterChildren(children)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3">
              {filterChildren(children)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
              {filterChildren(children)}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {filterChildren(children)}
            </p>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
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
              {filterChildren(children)}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
              {filterChildren(children)}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              {filterChildren(children)}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground">
              {filterChildren(children)}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props}>{filterChildren(children)}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {filterChildren(children)}
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
                {filterChildren(children)}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
              {filterChildren(children)}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {filterChildren(children)}
            </td>
          ),
          tbody: ({ children }) => <tbody>{filterChildren(children)}</tbody>,
          thead: ({ children }) => <thead>{filterChildren(children)}</thead>,
          tr: ({ children }) => <tr>{filterChildren(children)}</tr>,
          div: ({ children, ...props }: any) => <div {...props}>{filterChildren(children)}</div>,
          span: ({ children, ...props }: any) => <span {...props}>{filterChildren(children)}</span>,
          strong: ({ children }) => <strong>{filterChildren(children)}</strong>,
          em: ({ children }) => <em>{filterChildren(children)}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

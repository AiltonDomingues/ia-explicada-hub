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
  // Função auxiliar para filtrar undefined/null de children
  const filterChildren = (children: any) => {
    if (Array.isArray(children)) {
      const filtered = children.filter((c) => {
        // Remove undefined, null, e strings "undefined"
        if (c === undefined || c === null) return false;
        if (typeof c === 'string' && c.trim() === 'undefined') return false;
        return true;
      });
      return filtered.length > 0 ? filtered : null;
    }
    // Remove undefined, null, e strings "undefined"
    if (children === undefined || children === null) return null;
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
          h1: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">
                {filtered}
              </h1>
            );
          },
          h2: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3">
                {filtered}
              </h2>
            );
          },
          h3: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                {filtered}
              </h3>
            );
          },
          p: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <p className="text-muted-foreground leading-relaxed mb-4">
                {filtered}
              </p>
            );
          },
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
          pre: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 border border-border">
                {filtered}
              </pre>
            );
          },
          blockquote: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                {filtered}
              </blockquote>
            );
          },
          ul: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                {filtered}
              </ul>
            );
          },
          ol: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground">
                {filtered}
              </ol>
            );
          },
          li: ({ children, ...props }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <li {...props}>{filtered}</li>;
          },
          a: ({ href, children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <a
                href={href}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {filtered}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-lg max-w-full h-auto my-4 border border-border"
            />
          ),
          table: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-border">
                  {filtered}
                </table>
              </div>
            );
          },
          th: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                {filtered}
              </th>
            );
          },
          td: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return (
              <td className="border border-border px-4 py-2">
                {filtered}
              </td>
            );
          },
          tbody: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <tbody>{filtered}</tbody>;
          },
          thead: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <thead>{filtered}</thead>;
          },
          tr: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <tr>{filtered}</tr>;
          },
          div: ({ children, ...props }: any) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <div {...props}>{filtered}</div>;
          },
          span: ({ children, ...props }: any) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <span {...props}>{filtered}</span>;
          },
          strong: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <strong>{filtered}</strong>;
          },
          em: ({ children }) => {
            const filtered = filterChildren(children);
            if (!filtered) return null;
            return <em>{filtered}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

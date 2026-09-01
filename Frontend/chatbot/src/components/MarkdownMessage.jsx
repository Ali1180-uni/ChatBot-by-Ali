import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import 'highlight.js/styles/github-dark-dimmed.css';

function MarkdownMessage({ content }) {
  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="mb-3 mt-5 font-display text-xl font-bold first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-4 font-display text-lg font-bold first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-4 font-display text-base font-bold first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-[#aaa69d] pl-4 italic text-[#77746d]">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#506f8d] underline underline-offset-2">{children}<OpenInNewOutlinedIcon sx={{ fontSize: 13 }} /></a>,
          table: ({ children }) => <div className="my-3 overflow-x-auto rounded-lg border border-[#dfddd6]"><table className="min-w-full text-left text-xs">{children}</table></div>,
          th: ({ children }) => <th className="border-b border-[#dfddd6] bg-[#f0efeb] px-3 py-2 font-bold">{children}</th>,
          td: ({ children }) => <td className="border-b border-[#eeeae2] px-3 py-2 last:border-0">{children}</td>,
          input: ({ checked, ...props }) => <input {...props} type="checkbox" checked={checked} readOnly className="mr-2 accent-[#292929]" />,
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className?.includes('language-')) || String(children).includes('\n');
            return isBlock ? <CodeBlock className={className} value={String(children).replace(/\n$/, '')} /> : <code {...props} className="rounded bg-[#eceae4] px-1.5 py-0.5 font-mono text-[.86em] text-[#725c4a]">{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ className, value }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || 'code';

  async function copyCode() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#353b43] bg-[#24292f] text-left">
      <div className="flex items-center justify-between border-b border-[#3b424b] px-3 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#a8b0ba]">
        <span>{language}</span>
        <button type="button" onClick={copyCode} className="flex items-center gap-1.5 text-[#c7ced6] transition-colors hover:text-white" aria-label="Copy code">
          {copied ? <CheckOutlinedIcon sx={{ fontSize: 15 }} /> : <ContentCopyOutlinedIcon sx={{ fontSize: 15 }} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6"><code className={className}>{value}</code></pre>
    </div>
  );
}

export default MarkdownMessage;

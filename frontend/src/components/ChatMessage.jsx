import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
          isUser ? 'bg-ink text-amber font-display' : 'bg-amber text-ink'
        }`}
      >
        {isUser ? 'U' : '🎓'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-ink text-paper rounded-br-sm text-sm leading-relaxed'
            : 'bg-card border border-border rounded-bl-sm'
        }`}
      >
        {!isUser && (
          <span className="inline-flex items-center gap-1 bg-amber/20 border border-amber text-amber-dark font-mono text-xs px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
            ✦ Explanation
          </span>
        )}

        {isUser ? (
          <p>{content}</p>
        ) : (
          <div className="prose-study">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

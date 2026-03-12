import { X } from 'lucide-react';

const SUBJECTS = [
  { name: 'General',     icon: '📚' },
  { name: 'Mathematics', icon: '📐' },
  { name: 'Science',     icon: '🔬' },
  { name: 'History',     icon: '🏛️' },
  { name: 'Literature',  icon: '📖' },
  { name: 'Programming', icon: '💻' },
  { name: 'Languages',   icon: '🌍' },
  { name: 'Economics',   icon: '📊' },
];

export default function Sidebar({ activeSubject, onSelect, tabContext, onRemoveContext }) {
  return (
    <aside className="w-60 bg-cream border-r border-border flex flex-col gap-5 p-4 overflow-y-auto scrollbar-thin flex-shrink-0">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted border-b border-border pb-2 mb-2">
          Subjects
        </p>
        <nav className="space-y-0.5">
          {SUBJECTS.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                activeSubject === name
                  ? 'bg-ink text-paper'
                  : 'text-muted hover:bg-card hover:text-ink'
              }`}
            >
              <span>{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted border-b border-border pb-2 mb-2">
          Tab Context
        </p>
        <div className="bg-card border border-border rounded-xl p-3 text-xs">
          {tabContext ? (
            <div>
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-medium text-ink leading-snug line-clamp-2">
                  {tabContext.title || tabContext.url || 'Imported content'}
                </span>
                <button onClick={onRemoveContext} className="text-muted hover:text-ink flex-shrink-0">
                  <X size={12} />
                </button>
              </div>
              {tabContext.url && (
                <p className="font-mono text-muted truncate">{tabContext.url}</p>
              )}
              <p className="text-muted mt-1.5 line-clamp-3 leading-relaxed">
                {tabContext.content?.slice(0, 120)}…
              </p>
            </div>
          ) : (
            <p className="text-muted italic leading-relaxed">
              No tab imported. Use "Import Tab" to add context from your browser.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

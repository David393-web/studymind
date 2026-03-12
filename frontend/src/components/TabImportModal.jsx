import { useState } from 'react';
import { X } from 'lucide-react';

export default function TabImportModal({ onClose, onImport }) {
  const [form, setForm] = useState({ url: '', title: '', content: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImport = () => {
    if (!form.title && !form.content) return alert('Add a title or some content first');
    onImport(form);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Import Tab Context</h2>
          <button onClick={onClose} className="text-muted hover:text-ink"><X size={18} /></button>
        </div>

        <p className="text-sm text-muted mb-5 leading-relaxed">
          Paste content from your browser tab. StudyMind will use it to give you more relevant answers.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Page URL (optional)</label>
            <input
              type="url" value={form.url} onChange={set('url')}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-none focus:border-amber transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Page Title / Topic</label>
            <input
              type="text" value={form.title} onChange={set('title')}
              placeholder="e.g. Introduction to Quantum Mechanics"
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Page Content / Notes</label>
            <textarea
              rows={5} value={form.content} onChange={set('content')}
              placeholder="Select all text on the page (Ctrl+A), copy it, and paste here…"
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-amber transition-colors"
            />
          </div>
        </div>

        <div className="bg-amber/10 border border-amber rounded-xl p-3 mt-4 text-xs text-amber-dark leading-relaxed">
          ⚠️ Browsers block direct tab access for privacy. Copy-pasting the text is the standard workaround.
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onClose}
            className="border border-border text-muted px-4 py-2 rounded-xl text-sm hover:border-ink hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="bg-ink text-paper px-5 py-2 rounded-xl text-sm font-medium shadow-[2px_2px_0_#e8a020] hover:shadow-[3px_3px_0_#e8a020] hover:-translate-x-px hover:-translate-y-px transition-all"
          >
            Import Context
          </button>
        </div>
      </div>
    </div>
  );
}

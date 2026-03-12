import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { BookOpen, Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Left brand panel */}
      <div className="flex-col justify-between hidden w-1/2 p-12 lg:flex bg-ink">
        <div className="flex items-center gap-2">
          <BookOpen className="text-amber" size={20} />
          <span className="text-2xl font-black font-display text-paper">
            Study<span className="text-amber">Mind</span>
          </span>
        </div>
        <div>
          <h1 className="mb-4 text-5xl font-black leading-tight font-display text-paper">
            Your AI<br />University<br /><span className="text-amber">Tutor.</span>
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-paper/50">
            Expert explanations for any university-level subject — from quantum mechanics to differential equations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Mathematics', 'Science', 'Programming', 'Economics'].map((s) => (
            <span key={s} className="px-3 py-1 font-mono text-xs border rounded-full text-paper/30 border-paper/10">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center flex-1 p-8">
        <div className="w-full max-w-md">
          <h2 className="mb-1 text-3xl font-bold font-display text-ink">Welcome back</h2>
          <p className="mb-8 text-sm text-muted">Sign in to continue studying</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute -translate-y-1/2 left-3 top-1/2 text-muted" />
                <input
                  type="email" required value={form.email} onChange={set('email')}
                  placeholder="you@university.edu"
                  className="w-full py-3 pr-4 text-sm transition-colors border bg-card border-border rounded-xl pl-9 focus:outline-none focus:border-amber"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute -translate-y-1/2 left-3 top-1/2 text-muted" />
                <input
                  type="password" required value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  className="w-full py-3 pr-4 text-sm transition-colors border bg-card border-border rounded-xl pl-9 focus:outline-none focus:border-amber"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-ink text-paper font-medium py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[2px_2px_0_#e8a020] hover:shadow-[3px_3px_0_#e8a020] hover:-translate-x-px hover:-translate-y-px"
            >
              {loading ? 'Signing in…' : <><LogIn size={15} /> Sign In</>}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted">
            No account?{' '}
            <Link to="/register" className="font-medium text-amber-dark hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

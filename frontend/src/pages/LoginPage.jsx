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
    <div className="min-h-screen bg-paper flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <BookOpen className="text-amber" size={20} />
          <span className="font-display text-2xl font-black text-paper">
            Study<span className="text-amber">Mind</span>
          </span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-black text-paper leading-tight mb-4">
            Your AI<br />University<br /><span className="text-amber">Tutor.</span>
          </h1>
          <p className="text-paper/50 text-sm leading-relaxed max-w-xs">
            Expert explanations for any university-level subject — from quantum mechanics to differential equations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Mathematics', 'Science', 'Programming', 'Economics'].map((s) => (
            <span key={s} className="text-xs font-mono text-paper/30 border border-paper/10 px-3 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl font-bold text-ink mb-1">Welcome back</h2>
          <p className="text-muted text-sm mb-8">Sign in to continue studying</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email" required value={form.email} onChange={set('email')}
                  placeholder="you@university.edu"
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password" required value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber transition-colors"
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

          <p className="mt-6 text-center text-sm text-muted">
            No account?{' '}
            <Link to="/register" className="text-amber-dark font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

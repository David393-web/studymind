import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { BookOpen, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.email, form.password, form.full_name);
      toast.success('Account created! Welcome 🎓');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      <div className="hidden lg:flex w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <BookOpen className="text-amber" size={20} />
          <span className="font-display text-2xl font-black text-paper">
            Study<span className="text-amber">Mind</span>
          </span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-black text-paper leading-tight mb-4">
            Start<br />Learning<br /><span className="text-amber">Smarter.</span>
          </h1>
          <p className="text-paper/50 text-sm leading-relaxed max-w-xs">
            Join university students getting AI-powered help with their coursework.
          </p>
        </div>
        <p className="text-paper/20 font-mono text-xs">Free to get started</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl font-bold text-ink mb-1">Create account</h2>
          <p className="text-muted text-sm mb-8">Start your AI study journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'full_name', type: 'text', Icon: User, placeholder: 'John Doe' },
              { label: 'Email', key: 'email', type: 'email', Icon: Mail, placeholder: 'you@university.edu' },
              { label: 'Password', key: 'password', type: 'password', Icon: Lock, placeholder: 'Min. 6 characters' },
            ].map(({ label, key, type, Icon, placeholder }) => (
              <div key={key}>
                <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={type} required value={form[key]} onChange={set(key)} placeholder={placeholder}
                    className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber transition-colors"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="w-full bg-ink text-paper font-medium py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[2px_2px_0_#e8a020] hover:shadow-[3px_3px_0_#e8a020] hover:-translate-x-px hover:-translate-y-px"
            >
              {loading ? 'Creating account…' : <><UserPlus size={15} /> Create Account</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-dark font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

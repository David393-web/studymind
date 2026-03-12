import express from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../lib/supabase.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password || !full_name)
    return res.status(400).json({ error: 'All fields are required' });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name },
  });
  if (error) return res.status(400).json({ error: error.message });

  await supabase.from('profiles').insert({
    id: data.user.id,
    full_name,
    email,
  });

  const token = jwt.sign(
    { id: data.user.id, email, full_name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({ token, user: { id: data.user.id, email, full_name } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Invalid credentials' });

  const full_name = data.user.user_metadata?.full_name || '';
  const token = jwt.sign(
    { id: data.user.id, email, full_name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: data.user.id, email, full_name } });
});

export default router;

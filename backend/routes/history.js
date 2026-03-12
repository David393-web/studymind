import express from 'express';
import supabase from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/history?subject=Mathematics
router.get('/', requireAuth, async (req, res) => {
  const { subject } = req.query;

  let query = supabase
    .from('messages')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true })
    .limit(100);

  if (subject) query = query.eq('subject', subject);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json({ messages: data });
});

// DELETE /api/history
router.delete('/', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;

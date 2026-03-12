import express from 'express';
import Groq from 'groq-sdk';
import supabase from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/chat/ask
router.post('/ask', requireAuth, async (req, res) => {
  const { question, subject = 'General', messages = [], tabContext } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  let systemPrompt = `You are StudyMind, an expert AI tutor for university-level students.
Subject focus: ${subject}

When answering:
1. Give a direct, precise answer first
2. Provide a detailed explanation with academic depth
3. Show step-by-step working for math/science problems
4. Include formulas, theorems, and principles where relevant
5. Use real-world examples and analogies
6. For code questions, include well-commented examples
7. End with a ## Key Takeaway summarising the core concept
8. Suggest what to study next

Use markdown formatting. For math use $...$ inline and $$...$$ block LaTeX notation.`;

  if (tabContext) {
    systemPrompt += `\n\n---\nSTUDENT'S BROWSER TAB CONTEXT:\nTitle: ${tabContext.title || ''}\nURL: ${tabContext.url || ''}\nContent:\n${tabContext.content?.slice(0, 4000) || ''}\n---\nUse this context when relevant.`;
  }

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: question },
  ];

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const answer = response.choices[0].message.content;

    const { data: session } = await supabase
      .from('chat_sessions')
      .upsert(
        { user_id: req.user.id, subject, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,subject' }
      )
      .select()
      .single();

    if (session) {
      await supabase.from('messages').insert([
        { session_id: session.id, user_id: req.user.id, role: 'user', content: question, subject },
        { session_id: session.id, user_id: req.user.id, role: 'assistant', content: answer, subject },
      ]);
    }

    res.json({ answer });
  } catch (err) {
    console.error('Groq error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

export default router;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

**Step 4 — Add the env variable on Vercel too**
In your **frontend** Vercel project → Settings → Environment Variables → add:
```
VITE_API_URL = https://studymind-9jt1.vercel.app/
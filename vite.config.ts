import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Allow PORT override via .env.* variable VITE_DEV_PORT, fallback to 3000.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_DEV_PORT) || 3000; // ensure not 5173
  if (port === 5173) {
    // eslint-disable-next-line no-console
    console.warn('Port 5173 is disallowed for this project; using 3000 instead.');
  }
  return {
    plugins: [react()],
    server: {
      port: port === 5173 ? 3000 : port,
      strictPort: true, // fail fast if port taken
      open: false
    }
  };
});

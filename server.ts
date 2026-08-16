import express from 'express';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Fusion Forge Creation',
    timestamp: new Date().toISOString()
  });
});

// Serve static assets from the dist directory
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Fallback SPA routing for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fusion Forge Production Server running on port ${PORT}`);
  console.log(`Serving static files from: ${distPath}`);
});


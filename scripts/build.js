// Static build for free hosting: dist/ = public + src (API in /api runs as serverless on Vercel)
import { cpSync, rmSync, mkdirSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true }); mkdirSync('dist');
cpSync('public', 'dist', { recursive: true }); cpSync('src', 'dist/src', { recursive: true });
await import('../src/engine.js'); await import('../src/codes.js');
console.log('Build OK -> dist/');

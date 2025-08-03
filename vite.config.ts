import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // Le projet démarre depuis la racine
  plugins: [react()],
  base: './', // Important pour les chemins relatifs (surtout sur GitHub Pages)
  build: {
    outDir: 'dist', // Répertoire de sortie (par défaut, mais explicite ici)
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Fichier d'entrée
    },
  },
});

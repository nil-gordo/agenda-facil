
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Strict mode is temporarily disabled to prevent double mounting in development
createRoot(document.getElementById("root")!).render(<App />);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PageCDP from './Page1.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageCDP />
  </StrictMode>,
)

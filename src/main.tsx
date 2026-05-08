import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { CustomizerProvider } from './context/CustomizerContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <CartProvider>
        <CustomizerProvider>
          <App />
        </CustomizerProvider>
      </CartProvider>
    </HashRouter>
  </StrictMode>,
)

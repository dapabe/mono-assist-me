import './assets/main.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Root } from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
)

import './main.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Root } from './Root'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
)

import './i18n'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/main/App'

import { init, miniApp, viewport } from '@telegram-apps/sdk';

function startApp() {
  try {
    init()

    if (miniApp.ready.isAvailable()) {
      miniApp.ready()
    }

    if (viewport.mount.isAvailable()) {
      viewport.mount()
    }

  } catch (error) {
    console.error(error)
  }
}

startApp()

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
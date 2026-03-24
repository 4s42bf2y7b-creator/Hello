import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PlatingSwiperApp from './plating-swiper.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlatingSwiperApp />
  </StrictMode>,
)

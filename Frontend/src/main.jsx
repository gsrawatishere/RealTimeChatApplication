import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import MyRoute from '../src/Routes/MyRoute.jsx'
import { Toaster } from "react-hot-toast";


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={MyRoute} >
           <App />
      </RouterProvider>
    
  </StrictMode>,
)

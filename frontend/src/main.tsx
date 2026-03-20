import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { ProtectedRoute } from './components/protectedRoute'
import { Dashboard } from './pages/Dashboard'

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/auth/register" replace /> },
  { path: "/auth/register", element: <Register /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/page/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

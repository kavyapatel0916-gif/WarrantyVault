import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/Navbar'
import { LoadingPage } from '../components/ui'

/**
 * Layout for authenticated pages: sidebar + main content area
 */
export function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingPage />
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

/**
 * Layout for auth pages (login/register): centered card
 */
export function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingPage />
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}

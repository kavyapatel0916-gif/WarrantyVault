import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDate, formatDaysRemaining } from '../utils/format'
import { StatusBadge, LoadingRow, ErrorAlert, EmptyState } from '../components/ui'
import {
  Package, Shield, AlertTriangle, XCircle, Bell, Plus, ChevronRight
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, colorClass, description }) {
  return (
    <div className="card p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900">{value ?? '—'}</p>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function ReminderBanner({ items }) {
  if (!items.length) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-amber-600" />
        <h3 className="text-sm font-semibold text-amber-800">Warranty Reminders</h3>
      </div>
      <ul className="space-y-1">
        {items.map((p) => (
          <li key={p._id} className="text-sm text-amber-700 flex items-center gap-1">
            <span className="font-medium">{p.name}</span>
            {p.reminderDays?.length > 0 && (
              <span className="text-amber-600 font-bold">
                — {p.daysRemaining === 0 ? 'expires TODAY' : `${p.daysRemaining} days remaining`}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    dashboardAPI.summary()
      .then((res) => {
        if (mounted) setData(res.data.data)
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load dashboard.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const summary = data?.summary
  const upcoming = data?.upcoming || []
  const reminders = upcoming.filter((p) => p.reminderDays?.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
        </div>
        <Link to="/products/new" className="btn-primary" id="dashboard-add-product-btn">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingRow text="Loading dashboard…" />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Products"
              value={summary?.total}
              icon={Package}
              colorClass="bg-blue-50 text-blue-600"
            />
            <StatCard
              label="Active"
              value={summary?.active}
              icon={Shield}
              colorClass="bg-emerald-50 text-emerald-600"
              description="Warranty valid"
            />
            <StatCard
              label="Expiring Soon"
              value={summary?.expiring}
              icon={AlertTriangle}
              colorClass="bg-amber-50 text-amber-600"
              description="Within 30 days"
            />
            <StatCard
              label="Expired"
              value={summary?.expired}
              icon={XCircle}
              colorClass="bg-red-50 text-red-600"
            />
          </div>

          {/* Reminders */}
          {reminders.length > 0 && <ReminderBanner items={reminders} />}

          {/* Upcoming Expirations */}
          <div className="card">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="section-title">Upcoming Expirations</h2>
              <Link to="/products?status=expiring" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <EmptyState
                icon={Shield}
                title="No upcoming expirations"
                description="All your warranties are in good standing."
              />
            ) : (
              <div className="divide-y divide-slate-50">
                {upcoming.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.brand} · {product.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">{formatDate(product.warrantyExpiryDate)}</p>
                      <p className={`text-xs font-medium mt-0.5 ${
                        product.daysRemaining <= 7 ? 'text-red-600' :
                        product.daysRemaining <= 30 ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {formatDaysRemaining(product.daysRemaining)}
                      </p>
                    </div>
                    <StatusBadge status={product.warrantyStatus} />
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Empty state for new users */}
          {summary?.total === 0 && (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-brand-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Start tracking warranties</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                Add your first product to track its warranty, upload receipts, and get expiry reminders.
              </p>
              <Link to="/products/new" className="btn-primary inline-flex">
                <Plus className="w-4 h-4" />
                Add your first product
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

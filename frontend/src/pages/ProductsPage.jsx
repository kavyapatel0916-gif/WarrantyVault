import React, { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productsAPI } from '../api'
import { formatDate, formatCurrency, formatDaysRemaining } from '../utils/format'
import { StatusBadge, LoadingRow, ErrorAlert, EmptyState, ConfirmDialog, Toast } from '../components/ui'
import { Plus, Search, Package, Trash2, Edit, Eye, Filter, X } from 'lucide-react'

const CATEGORIES = ['Electronics', 'Appliances', 'Computers', 'Accessories', 'Furniture', 'Automotive', 'Other']

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const status = searchParams.get('status') || ''
  const sort = searchParams.get('sort') || 'expiry_asc'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    setError('')
    productsAPI.list({ q, category, status, sort, page, limit: 20 })
      .then((res) => {
        setProducts(res.data.data.products)
        setPagination(res.data.data.pagination)
      })
      .catch((err) => setError(err.message || 'Failed to load products.'))
      .finally(() => setLoading(false))
  }, [q, category, status, sort, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productsAPI.delete(deleteTarget._id)
      setToast({ message: `"${deleteTarget.name}" deleted.`, type: 'success' })
      fetchProducts()
    } catch (err) {
      setToast({ message: err.message || 'Delete failed.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const hasFilters = q || category || status

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-slate-500 text-sm">{pagination.total ?? 0} total products</p>
        </div>
        <Link to="/products/new" className="btn-primary" id="products-add-btn">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="products-search"
              type="search"
              placeholder="Search by name or brand…"
              className="input pl-9"
              value={q}
              onChange={(e) => updateParam('q', e.target.value)}
            />
          </div>

          <select
            id="products-category-filter"
            className="input w-auto"
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            id="products-status-filter"
            className="input w-auto"
            value={status}
            onChange={(e) => updateParam('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>

          <select
            id="products-sort"
            className="input w-auto"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            <option value="expiry_asc">Expiry ↑ (soonest)</option>
            <option value="expiry_desc">Expiry ↓ (latest)</option>
            <option value="newest">Newest first</option>
          </select>

          {hasFilters && (
            <button
              className="btn-ghost flex items-center gap-1 text-slate-500"
              onClick={() => setSearchParams({})}
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Product list */}
      <div className="card">
        {loading ? (
          <LoadingRow text="Loading products…" />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title={hasFilters ? 'No products match your filters' : 'No products yet'}
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Add your first product to start tracking warranties.'}
            action={!hasFilters && (
              <Link to="/products/new" className="btn-primary inline-flex">
                <Plus className="w-4 h-4" /> Add Product
              </Link>
            )}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Purchase Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Expiry</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.brand} {p.model && `· ${p.model}`}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{p.category}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(p.purchaseDate)}</td>
                      <td className="px-4 py-4">
                        <div className="text-slate-600">{formatDate(p.warrantyExpiryDate)}</div>
                        <div className={`text-xs mt-0.5 ${
                          p.daysRemaining < 0 ? 'text-red-500' :
                          p.daysRemaining <= 30 ? 'text-amber-600' : 'text-slate-400'
                        }`}>{formatDaysRemaining(p.daysRemaining)}</div>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={p.warrantyStatus} /></td>
                      <td className="px-4 py-4 text-slate-600">{formatCurrency(p.purchasePrice, p.currency)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/products/${p._id}`}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/products/${p._id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {products.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="flex items-start gap-3 px-4 py-4 hover:bg-slate-50">
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand} · {p.category}</p>
                    <p className="text-xs text-slate-500 mt-1">Expires {formatDate(p.warrantyExpiryDate)}</p>
                  </div>
                  <StatusBadge status={p.warrantyStatus} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => updateParam('page', pagination.page - 1)}
                    className="btn-secondary text-xs py-1 px-3 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => updateParam('page', pagination.page + 1)}
                    className="btn-secondary text-xs py-1 px-3 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Delete "${deleteTarget?.name}"? This will also remove all receipts and service records. This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete Product'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

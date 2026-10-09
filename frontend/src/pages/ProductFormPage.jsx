import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productsAPI } from '../api'
import { ErrorAlert, SuccessAlert, Spinner } from '../components/ui'
import { todayString } from '../utils/format'
import { ChevronLeft } from 'lucide-react'

const CATEGORIES = ['Electronics', 'Appliances', 'Computers', 'Accessories', 'Furniture', 'Automotive', 'Other']

const DEFAULT_FORM = {
  name: '',
  brand: '',
  model: '',
  category: 'Electronics',
  serialNumber: '',
  seller: '',
  purchaseDate: todayString(),
  warrantyMonths: 12,
  purchasePrice: '',
  currency: 'INR',
  notes: '',
}

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isEditing) return
    productsAPI.get(id)
      .then((res) => {
        const p = res.data.data.product
        setForm({
          name: p.name || '',
          brand: p.brand || '',
          model: p.model || '',
          category: p.category || 'Electronics',
          serialNumber: p.serialNumber || '',
          seller: p.seller || '',
          purchaseDate: p.purchaseDate || todayString(),
          warrantyMonths: p.warrantyMonths ?? 12,
          purchasePrice: p.purchasePrice ?? '',
          currency: p.currency || 'INR',
          notes: p.notes || '',
        })
      })
      .catch((err) => setError(err.message || 'Failed to load product.'))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      warrantyMonths: parseInt(form.warrantyMonths, 10),
      purchasePrice: parseFloat(form.purchasePrice),
    }

    try {
      if (isEditing) {
        await productsAPI.update(id, payload)
        setSuccess('Product updated successfully.')
        setTimeout(() => navigate(`/products/${id}`), 800)
      } else {
        const res = await productsAPI.create(payload)
        setSuccess('Product created successfully.')
        setTimeout(() => navigate(`/products/${res.data.data.product._id}`), 800)
      }
    } catch (err) {
      setError(err.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h1 className="page-title">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
        <p className="text-slate-500 text-sm">
          {isEditing ? 'Update the product details below.' : 'Fill in the product details to start tracking its warranty.'}
        </p>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="label">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder="e.g. Samsung Galaxy S24"
                value={form.name}
                onChange={handleChange}
                maxLength={120}
              />
            </div>
            <div>
              <label htmlFor="brand" className="label">Brand *</label>
              <input
                id="brand"
                name="brand"
                type="text"
                required
                className="input"
                placeholder="e.g. Samsung"
                value={form.brand}
                onChange={handleChange}
                maxLength={80}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="model" className="label">Model <span className="text-slate-400">(optional)</span></label>
              <input
                id="model"
                name="model"
                type="text"
                className="input"
                placeholder="e.g. SM-S921B"
                value={form.model}
                onChange={handleChange}
                maxLength={80}
              />
            </div>
            <div>
              <label htmlFor="category" className="label">Category *</label>
              <select
                id="category"
                name="category"
                required
                className="input"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purchaseDate" className="label">Purchase Date *</label>
              <input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                required
                className="input"
                value={form.purchaseDate}
                onChange={handleChange}
                max={todayString()}
              />
            </div>
            <div>
              <label htmlFor="warrantyMonths" className="label">Warranty Duration (months) *</label>
              <input
                id="warrantyMonths"
                name="warrantyMonths"
                type="number"
                required
                className="input"
                placeholder="12"
                min={0}
                max={240}
                value={form.warrantyMonths}
                onChange={handleChange}
              />
              {form.purchaseDate && form.warrantyMonths !== '' && (
                <p className="text-xs text-slate-500 mt-1">
                  {form.warrantyMonths === 0 ? 'Expires on purchase day' : 
                    `Approx. ${Math.ceil(form.warrantyMonths / 12)} year${form.warrantyMonths >= 24 ? 's' : ''} warranty`}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purchasePrice" className="label">Purchase Price (INR) *</label>
              <input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                required
                className="input"
                placeholder="e.g. 79999"
                min={0}
                step="0.01"
                value={form.purchasePrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="serialNumber" className="label">Serial Number <span className="text-slate-400">(optional)</span></label>
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                className="input"
                placeholder="e.g. R5CW000000A"
                value={form.serialNumber}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label htmlFor="seller" className="label">Seller / Store <span className="text-slate-400">(optional)</span></label>
            <input
              id="seller"
              name="seller"
              type="text"
              className="input"
              placeholder="e.g. Amazon India, Reliance Digital"
              value={form.seller}
              onChange={handleChange}
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="notes" className="label">Notes <span className="text-slate-400">(optional)</span></label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="input resize-none"
              placeholder="Any additional notes about this product…"
              value={form.notes}
              onChange={handleChange}
              maxLength={1000}
            />
            <p className="text-xs text-slate-400 mt-1">{form.notes.length}/1000</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 sm:flex-none sm:px-8 py-2.5"
              id="product-form-submit-btn"
            >
              {saving ? <><Spinner size="sm" /> Saving…</> : (isEditing ? 'Save Changes' : 'Add Product')}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

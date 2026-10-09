import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productsAPI, receiptsAPI, servicesAPI } from '../api'
import { formatDate, formatCurrency, formatDaysRemaining, formatFileSize } from '../utils/format'
import {
  StatusBadge, LoadingRow, ErrorAlert, SuccessAlert, ConfirmDialog, Toast, EmptyState, Spinner
} from '../components/ui'
import {
  Package, Edit, Trash2, ChevronLeft, Upload, Download, Eye,
  FileText, Camera, CheckCircle, AlertCircle, Plus, Wrench, Calendar
} from 'lucide-react'

/* ─── Receipt Section ─── */
function ReceiptsSection({ productId }) {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [ocrTarget, setOcrTarget] = useState(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrResult, setOcrResult] = useState(null)

  const fetchReceipts = useCallback(() => {
    receiptsAPI.listForProduct(productId)
      .then((res) => setReceipts(res.data.data.receipts))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => { fetchReceipts() }, [fetchReceipts])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('receipt', file)
    try {
      await receiptsAPI.upload(productId, formData)
      setToast({ message: 'Receipt uploaded successfully.', type: 'success' })
      fetchReceipts()
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDownload = async (receipt) => {
    try {
      const res = await receiptsAPI.download(receipt._id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = receipt.originalName
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setToast({ message: 'Download failed.', type: 'error' })
    }
  }

  const handleOcr = async (receipt) => {
    setOcrTarget(receipt)
    setOcrLoading(true)
    setOcrResult(null)
    try {
      const res = await receiptsAPI.ocr(receipt._id)
      setOcrResult(res.data.data)
    } catch (err) {
      setOcrResult({ error: err.message || 'OCR failed.' })
    } finally {
      setOcrLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await receiptsAPI.delete(deleteTarget._id)
      setToast({ message: 'Receipt deleted.', type: 'success' })
      fetchReceipts()
    } catch (err) {
      setToast({ message: err.message || 'Delete failed.', type: 'error' })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="section-title flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          Receipts & Documents
        </h2>
        <label className={`btn-primary cursor-pointer ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading…' : 'Upload File'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
            id="receipt-upload-input"
          />
        </label>
      </div>

      <div className="p-4">
        {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
        <p className="text-xs text-slate-500 mb-3">Accepts JPEG, PNG, WEBP, PDF • Max 5 MB each</p>

        {loading ? <LoadingRow /> : receipts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No receipts uploaded"
            description="Upload a receipt or warranty document for this product."
          />
        ) : (
          <div className="space-y-2">
            {receipts.map((r) => (
              <div key={r._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-9 h-9 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{r.originalName}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(r.sizeBytes)} · {formatDate(r.createdAt?.slice(0, 10))} · {r.mimeType}</p>
                  {r.ocrStatus === 'complete' && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 mt-0.5">
                      <CheckCircle className="w-3 h-3" /> OCR complete
                    </span>
                  )}
                  {r.ocrStatus === 'failed' && (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> OCR failed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(r)}
                    className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-brand-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {r.mimeType !== 'application/pdf' && (
                    <button
                      onClick={() => handleOcr(r)}
                      className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-brand-600 transition-colors"
                      title="Run OCR"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(r)}
                    className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OCR review panel */}
      {ocrTarget && (
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-600" />
              OCR Review — {ocrTarget.originalName}
            </h3>
            <button onClick={() => { setOcrTarget(null); setOcrResult(null) }} className="text-slate-400 hover:text-slate-600 text-sm">Close</button>
          </div>
          {ocrLoading && <LoadingRow text="Running OCR…" />}
          {ocrResult?.error && (
            <ErrorAlert message={ocrResult.error} />
          )}
          {ocrResult && !ocrResult.error && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>⚠ Important:</strong> OCR results are tentative suggestions. Review and correct them carefully before use. Confidence: {ocrResult.confidence}%
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Raw Extracted Text</p>
                <pre className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                  {ocrResult.rawText || '(No text detected)'}
                </pre>
              </div>
              {ocrResult.candidates && Object.keys(ocrResult.candidates).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Suggested Fields (review before using)</p>
                  <div className="space-y-2">
                    {ocrResult.candidates.merchantHint && (
                      <div className="flex gap-2 items-center text-sm">
                        <span className="text-slate-500 w-28 flex-shrink-0">Merchant:</span>
                        <span className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-amber-800 italic">{ocrResult.candidates.merchantHint.value}</span>
                      </div>
                    )}
                    {ocrResult.candidates.dateHint && (
                      <div className="flex gap-2 items-center text-sm">
                        <span className="text-slate-500 w-28 flex-shrink-0">Date found:</span>
                        <span className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-amber-800 italic">{ocrResult.candidates.dateHint.value}</span>
                      </div>
                    )}
                    {ocrResult.candidates.amountHint && (
                      <div className="flex gap-2 items-center text-sm">
                        <span className="text-slate-500 w-28 flex-shrink-0">Amount:</span>
                        <span className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-amber-800 italic">₹ {ocrResult.candidates.amountHint.value}</span>
                      </div>
                    )}
                    {ocrResult.candidates.productHint && (
                      <div className="flex gap-2 items-center text-sm">
                        <span className="text-slate-500 w-28 flex-shrink-0">Product line:</span>
                        <span className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-amber-800 italic">{ocrResult.candidates.productHint.value}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Use these values to manually update the product fields. All fields marked italic are uncertain.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Receipt"
        message={`Delete "${deleteTarget?.originalName}"? This action cannot be undone.`}
        confirmLabel="Delete Receipt"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

/* ─── Service Records Section ─── */
function ServiceSection({ productId }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const emptyForm = {
    serviceDate: new Date().toISOString().slice(0, 10),
    provider: '',
    description: '',
    cost: '',
    status: 'completed',
    notes: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchServices = useCallback(() => {
    servicesAPI.listForProduct(productId)
      .then((res) => setServices(res.data.data.services))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => { fetchServices() }, [fetchServices])

  const openAdd = () => {
    setForm(emptyForm)
    setEditTarget(null)
    setShowForm(true)
  }

  const openEdit = (svc) => {
    setForm({
      serviceDate: svc.serviceDate,
      provider: svc.provider || '',
      description: svc.description,
      cost: svc.cost ?? '',
      status: svc.status,
      notes: svc.notes || '',
    })
    setEditTarget(svc)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      cost: form.cost === '' ? null : parseFloat(form.cost),
    }
    try {
      if (editTarget) {
        await servicesAPI.update(editTarget._id, payload)
        setToast({ message: 'Service record updated.', type: 'success' })
      } else {
        await servicesAPI.create(productId, payload)
        setToast({ message: 'Service record added.', type: 'success' })
      }
      setShowForm(false)
      fetchServices()
    } catch (err) {
      setError(err.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await servicesAPI.delete(deleteTarget._id)
      setToast({ message: 'Service record deleted.', type: 'success' })
      fetchServices()
    } catch (err) {
      setToast({ message: err.message || 'Delete failed.', type: 'error' })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="section-title flex items-center gap-2">
          <Wrench className="w-5 h-5 text-brand-600" />
          Service History
        </h2>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          {error && <div className="mb-3"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}
          <h3 className="font-semibold text-slate-800 mb-4">{editTarget ? 'Edit Service Record' : 'Add Service Record'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Service Date *</label>
                <input
                  type="date"
                  required
                  className="input"
                  value={form.serviceDate}
                  onChange={(e) => setForm((f) => ({ ...f, serviceDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="completed">Completed</option>
                  <option value="requested">Requested</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description *</label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g. Screen replacement"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Provider / Technician <span className="text-slate-400">(optional)</span></label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Samsung Service Center"
                  value={form.provider}
                  onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                  maxLength={120}
                />
              </div>
              <div>
                <label className="label">Cost (INR) <span className="text-slate-400">(optional)</span></label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g. 2500"
                  min={0}
                  value={form.cost}
                  onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="label">Notes <span className="text-slate-400">(optional)</span></label>
              <textarea
                rows={2}
                className="input resize-none"
                placeholder="Additional notes…"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                maxLength={1000}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : (editTarget ? 'Save Changes' : 'Add Record')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4">
        {loading ? <LoadingRow /> : services.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No service records"
            description="Track repairs and maintenance for this product."
          />
        ) : (
          <div className="space-y-3">
            {services.map((svc) => (
              <div key={svc._id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg group">
                <div className="w-9 h-9 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-800">{svc.description}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      svc.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {svc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(svc.serviceDate)}
                    {svc.provider && ` · ${svc.provider}`}
                    {svc.cost !== null && svc.cost !== undefined && ` · ${formatCurrency(svc.cost)}`}
                  </p>
                  {svc.notes && <p className="text-xs text-slate-400 mt-1">{svc.notes}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(svc)}
                    className="p-1.5 rounded hover:bg-white text-slate-500 hover:text-brand-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(svc)}
                    className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Service Record"
        message="Delete this service record? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

/* ─── Main Product Detail Page ─── */
export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const fetchProduct = useCallback(() => {
    productsAPI.get(id)
      .then((res) => setProduct(res.data.data.product))
      .catch((err) => setError(err.message || 'Product not found.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { fetchProduct() }, [fetchProduct])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productsAPI.delete(id)
      navigate('/products', { replace: true })
    } catch (err) {
      setToast({ message: err.message || 'Delete failed.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <ErrorAlert message={error || 'Product not found.'} />
        <button onClick={() => navigate('/products')} className="btn-secondary">← Back to Products</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-2">
          <Link to={`/products/${id}/edit`} className="btn-secondary">
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button onClick={() => setDeleteOpen(true)} className="btn-danger">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Product header card */}
      <div className="card p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-7 h-7 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
              <StatusBadge status={product.warrantyStatus} />
            </div>
            <p className="text-slate-500">{product.brand} {product.model && `· ${product.model}`} · {product.category}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-lg font-bold ${
              product.daysRemaining < 0 ? 'text-red-600' :
              product.daysRemaining <= 7 ? 'text-red-600' :
              product.daysRemaining <= 30 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {formatDaysRemaining(product.daysRemaining)}
            </p>
            <p className="text-sm text-slate-500">Warranty expiry: {formatDate(product.warrantyExpiryDate)}</p>
          </div>
        </div>

        {/* Product details grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Purchase Date</p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{formatDate(product.purchaseDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Warranty</p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{product.warrantyMonths} months</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Purchase Price</p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{formatCurrency(product.purchasePrice, product.currency)}</p>
          </div>
          {product.serialNumber && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Serial Number</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5 font-mono">{product.serialNumber}</p>
            </div>
          )}
          {product.seller && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Seller</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{product.seller}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Added</p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{formatDate(product.createdAt?.slice(0, 10))}</p>
          </div>
        </div>

        {product.notes && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Notes</p>
            <p className="text-sm text-slate-700">{product.notes}</p>
          </div>
        )}

        {/* Reminder notice */}
        {product.reminderDays?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-100">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                ⚠ Warranty reminder: {product.daysRemaining} day{product.daysRemaining !== 1 ? 's' : ''} remaining.
                Consider renewing or noting down service contacts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Receipts */}
      <ReceiptsSection productId={id} />

      {/* Service History */}
      <ServiceSection productId={id} />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Product"
        message={`Delete "${product.name}"? All receipts and service records will also be permanently deleted. This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete Product'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatusBadge, ErrorAlert, EmptyState, ConfirmDialog } from '../components/ui'

describe('UI Components', () => {
  describe('StatusBadge', () => {
    test('renders Active badge with correct text', () => {
      render(<StatusBadge status="active" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    test('renders Expiring badge with correct text', () => {
      render(<StatusBadge status="expiring" />)
      expect(screen.getByText('Expiring')).toBeInTheDocument()
    })

    test('renders Expired badge with correct text', () => {
      render(<StatusBadge status="expired" />)
      expect(screen.getByText('Expired')).toBeInTheDocument()
    })
  });

  describe('ErrorAlert', () => {
    test('renders error message', () => {
      render(<ErrorAlert message="Something went wrong" />)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    test('calls onDismiss when close button is clicked', () => {
      const handleDismiss = vi.fn()
      render(<ErrorAlert message="Dismissable error" onDismiss={handleDismiss} />)
      const dismissBtn = screen.getByRole('button')
      fireEvent.click(dismissBtn)
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })
  });

  describe('EmptyState', () => {
    test('renders title and description', () => {
      render(
        <EmptyState
          title="No products yet"
          description="Start by adding your first product"
          action={<button>Add Now</button>}
        />
      )
      expect(screen.getByText('No products yet')).toBeInTheDocument()
      expect(screen.getByText('Start by adding your first product')).toBeInTheDocument()
      expect(screen.getByText('Add Now')).toBeInTheDocument()
    })
  });

  describe('ConfirmDialog', () => {
    test('renders confirmation dialog when open is true', () => {
      const onConfirm = vi.fn()
      const onCancel = vi.fn()
      render(
        <ConfirmDialog
          open={true}
          title="Delete Confirmation"
          message="Are you sure you want to delete this?"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )
      expect(screen.getByText('Delete Confirmation')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument()

      const cancelBtn = screen.getByText('Cancel')
      fireEvent.click(cancelBtn)
      expect(onCancel).toHaveBeenCalledTimes(1)

      const deleteBtn = screen.getByText('Delete')
      fireEvent.click(deleteBtn)
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    test('does not render when open is false', () => {
      const { container } = render(
        <ConfirmDialog
          open={false}
          title="Delete Confirmation"
          message="Hidden"
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      )
      expect(container.firstChild).toBeNull()
    })
  });
})

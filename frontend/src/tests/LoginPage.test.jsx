import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import { AuthProvider } from '../context/AuthContext'
import { authAPI } from '../api'

vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    authAPI: {
      ...actual.authAPI,
      me: vi.fn().mockRejectedValue(new Error('Not logged in')),
    },
  }
})

describe('LoginPage', () => {
  test('renders login form elements properly', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('WarrantyVault')).toBeInTheDocument()
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })

  test('toggles password visibility when eye icon is clicked', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleBtn = screen.getByRole('button', { name: /Show password/i })
    fireEvent.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')

    const hideBtn = screen.getByRole('button', { name: /Hide password/i })
    fireEvent.click(hideBtn)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { useFormHandler } from '../../app/composables/useFormHandler'

vi.mock('#imports', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn(),
    clear: vi.fn()
  }))
}))

describe('useFormHandler', () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email')
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global fetch mock if any
    ;(global as any).$fetch = vi.fn()
  })

  it('initializes with default values', () => {
    const { state, errors, loading } = useFormHandler({
      schema,
      defaults: { name: '', email: '' }
    })

    expect(state.name).toBe('')
    expect(state.email).toBe('')
    expect(Object.keys(errors).length).toBe(0)
    expect(loading.value).toBe(false)
  })

  it('validates schema correctly and populates errors', () => {
    const { state, errors, validate } = useFormHandler({
      schema,
      defaults: { name: '', email: 'not-an-email' }
    })

    const isValid = validate()
    expect(isValid).toBe(false)
    expect(errors.name).toBe('Name is required')
    expect(errors.email).toBe('Invalid email')
  })

  it('clears errors when validation passes', () => {
    const { state, errors, validate } = useFormHandler({
      schema,
      defaults: { name: '', email: 'not-an-email' }
    })

    validate()
    expect(errors.name).toBeDefined()

    state.name = 'John Doe'
    state.email = 'john@example.com'
    
    const isValid = validate()
    expect(isValid).toBe(true)
    expect(Object.keys(errors).length).toBe(0)
  })

  it('calls onSubmit custom handler if provided', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true })
    const { state, submit } = useFormHandler({
      schema,
      defaults: { name: 'John Doe', email: 'john@example.com' },
      onSubmit: mockSubmit
    })

    await submit()
    expect(mockSubmit).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com' })
  })

  it('calls $fetch if endpoint is provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ success: true })
    ;(global as any).$fetch = mockFetch

    const { submit } = useFormHandler({
      schema,
      defaults: { name: 'John Doe', email: 'john@example.com' },
      endpoint: '/api/test'
    })

    await submit()
    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'POST',
      body: { name: 'John Doe', email: 'john@example.com' }
    }))
  })
})

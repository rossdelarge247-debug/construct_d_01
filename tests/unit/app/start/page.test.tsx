import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import { notFound } from 'next/navigation'
import StartPage from '@/app/start/page'

describe('StartPage', () => {
  it('calls notFound() from next/navigation on render', () => {
    expect(() => StartPage()).toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })
})

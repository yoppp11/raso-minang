import { describe, it, expect } from 'vitest'
import { http } from '../../helpers/axios'

describe('Axios Helper', () => {
  it('should have the correct base URL', () => {
    expect(http.defaults.baseURL).toBeTruthy()
  })

  it('should be an axios instance', () => {
    expect(http).toBeDefined()
    expect(typeof http.get).toBe('function')
    expect(typeof http.post).toBe('function')
    expect(typeof http.put).toBe('function')
    expect(typeof http.delete).toBe('function')
  })
})

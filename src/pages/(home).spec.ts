import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomePage from './\(home\).vue'

// Mock pro navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
})

// Mock pro navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn()
})

// Mock pro FileReader
global.FileReader = vi.fn().mockImplementation(() => ({
  onload: null,
  onerror: null,
  onabort: null,
  onloadend: null,
  onloadstart: null,
  onprogress: null,
  readyState: 0,
  result: null,
  error: null,
  
  readAsDataURL() {
    setTimeout(() => {
      // @ts-ignore - Ignorujeme this kontext pro testy
      if (this.onload) {
        this.onload({ target: { result: 'data:image/jpeg;base64,test' } })
      }
    }, 0)
  },
  
  readAsArrayBuffer() {},
  readAsBinaryString() {},
  readAsText() {},
  abort() {}
})) as any

// Mock pro localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock pro router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/preview', component: { template: '<div>Preview</div>' } }
  ]
})

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
  })

  it('renders correctly with online status', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    })
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('h1').text()).toBe('SnapHub')
    expect(wrapper.find('[aria-label="Vybrat fotky z galerie"]').exists()).toBe(true)
    expect(wrapper.find('.text-sm.text-gray-600').text()).toContain('JPG/PNG/HEIC')
  })

  it('shows offline banner when offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    })
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.bg-amber-50').exists()).toBe(true)
    expect(wrapper.text()).toContain('Jste offline')
  })

  it('has proper button dimensions for accessibility', () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('w-64')
    expect(button.classes()).toContain('h-64')
  })

  it('triggers haptic feedback on button click', async () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(navigator.vibrate).toHaveBeenCalledWith(50)
  })

  it('handles file selection correctly', async () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    // Mock pro input element
    const mockInput = {
      type: '',
      multiple: false,
      accept: '',
      click: vi.fn(),
      onchange: null as any
    }

    const createElementSpy = vi.spyOn(document, 'createElement')
    createElementSpy.mockReturnValue(mockInput as any)

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(createElementSpy).toHaveBeenCalledWith('input')
    expect(mockInput.type).toBe('file')
    expect(mockInput.multiple).toBe(true)
    expect(mockInput.accept).toContain('image/jpeg')
  })
})

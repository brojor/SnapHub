import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBar from './AppBar.vue'

describe('AppBar', () => {
  it('renders with title correctly', () => {
    const wrapper = mount(AppBar, {
      props: {
        title: 'Test Title'
      }
    })
    
    expect(wrapper.find('h1').text()).toBe('Test Title')
  })

  it('shows back button when showBackButton is true', () => {
    const wrapper = mount(AppBar, {
      props: {
        title: 'Test Title',
        showBackButton: true
      }
    })
    
    expect(wrapper.find('button[aria-label="Zpět"]').exists()).toBe(true)
  })

  it('shows logo when showBackButton is false', () => {
    const wrapper = mount(AppBar, {
      props: {
        title: 'Test Title',
        showBackButton: false
      }
    })
    
    expect(wrapper.find('button[aria-label="Zpět"]').exists()).toBe(false)
    expect(wrapper.find('.w-8.h-8.bg-blue-600').exists()).toBe(true)
  })

  it('emits back event when back button is clicked', async () => {
    const wrapper = mount(AppBar, {
      props: {
        title: 'Test Title',
        showBackButton: true
      }
    })
    
    await wrapper.find('button[aria-label="Zpět"]').trigger('click')
    
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('calls onBackClick when provided', async () => {
    const onBackClick = vi.fn()
    const wrapper = mount(AppBar, {
      props: {
        title: 'Test Title',
        showBackButton: true,
        onBackClick
      }
    })
    
    await wrapper.find('button[aria-label="Zpět"]').trigger('click')
    
    expect(onBackClick).toHaveBeenCalled()
    expect(wrapper.emitted('back')).toBeFalsy() // Should not emit when onBackClick is provided
  })

  it('renders right slot content', () => {
    const wrapper = mount(AppBar, {
      props: {
        title: 'Test Title'
      },
      slots: {
        right: '<div class="test-right-content">Right Content</div>'
      }
    })
    
    expect(wrapper.find('.test-right-content').exists()).toBe(true)
    expect(wrapper.find('.test-right-content').text()).toBe('Right Content')
  })
})

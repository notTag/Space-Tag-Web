import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductShowcase from './ProductShowcase.vue'
import TerminalDemo from './TerminalDemo.vue'

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

describe('showcase navigation', () => {
  it('defaults to App and switches panels with keyboard navigation', async () => {
    const wrapper = mount(ProductShowcase, { global: { stubs: { ProductDemo: true, TerminalDemo: true } } })
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0]!.attributes('aria-selected')).toBe('true')
    await tabs[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(tabs[1]!.attributes('aria-selected')).toBe('true')
    expect(wrapper.get('#showcase-panel-Code').isVisible()).toBe(true)
    expect(wrapper.get('#showcase-panel-App').isVisible()).toBe(false)
    expect(wrapper.get('.repository-preview').attributes('href')).toBe('https://github.com/notTag/Space-Tag-CLI')
    await tabs[1]!.trigger('keydown', { key: 'End' })
    expect(tabs[2]!.attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })
})

describe('terminal walkthrough', () => {
  it('executes commands before updating desktop labels and cleans up its timer', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    const wrapper = mount(TerminalDemo)
    expect(wrapper.get('.space-labels').text()).not.toContain('Website')
    await vi.advanceTimersByTimeAsync(1500)
    expect(wrapper.get('.command').text()).toContain('space-tag Website 1')
    expect(wrapper.get('.space-labels').text()).toContain('Website')
    await wrapper.get('[aria-label="Next command"]').trigger('click')
    expect(wrapper.get('.command').text()).toContain('space-tag clear')
    expect(wrapper.get('.space-labels').text()).not.toContain('Website')
    await wrapper.get('[aria-label="Next command"]').trigger('click')
    expect(wrapper.findAll('.space-labels span')).toHaveLength(5)
    await wrapper.get('[aria-label="Next command"]').trigger('click')
    expect(wrapper.get('.space-labels').classes()).toContain('right')
    await wrapper.findAll('.controls button').find(button => button.text() === 'Replay')!.trigger('click')
    expect(wrapper.findAll('.space-labels span')).toHaveLength(3)
    expect(wrapper.get('.space-labels').classes()).not.toContain('right')
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('shows a static example and permits stepping with reduced motion', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const wrapper = mount(TerminalDemo)
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.command').text()).toContain('space-tag Website 1')
    expect(vi.getTimerCount()).toBe(0)
    await wrapper.get('[aria-label="Next command"]').trigger('click')
    expect(wrapper.get('.space-labels').text()).not.toContain('Website')
    wrapper.unmount()
  })
})

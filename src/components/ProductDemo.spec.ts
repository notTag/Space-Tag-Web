import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductDemo from './ProductDemo.vue'

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    disconnect() {}
  })
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }))
})
afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

async function startRename(index = 0) {
  const wrapper = mount(ProductDemo, { attachTo: document.body })
  await wrapper.findAll('.tag-bar button')[index]!.trigger('contextmenu')
  return wrapper
}

describe('demo renaming', () => {
  it('saves the typed label on Enter/form submit', async () => {
    const wrapper = await startRename()
    await wrapper.get('input').setValue('Wedding')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.findAll('.tag-bar button')[0]!.text()).toBe('Wedding')
    wrapper.unmount()
  })

  it('saves on focus loss without submitting', async () => {
    const wrapper = await startRename(1)
    await wrapper.get('input').setValue('Project tracker')
    wrapper.get('input').element.blur()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.tag-bar button')[1]!.text()).toBe('Project tracker')
    wrapper.unmount()
  })

  it('keeps the original label when Escape is followed by blur', async () => {
    const wrapper = await startRename()
    const editor = wrapper.get('input')
    await editor.setValue('Discard this')
    await editor.trigger('keydown', { key: 'Escape' })
    await editor.trigger('blur')
    expect(wrapper.findAll('.tag-bar button')[0]!.text()).toBe('1')
    wrapper.unmount()
  })

  it('commits to the edited space before switching to another space', async () => {
    const wrapper = await startRename()
    await wrapper.get('input').setValue('Space one')
    await wrapper.get('[aria-label="Switch to space 2: 2"]').trigger('click')
    expect(wrapper.findAll('.tag-bar button').map(tag => tag.text())).toEqual(['Space one', '2', '3'])
    expect(wrapper.findAll('.tag-bar button')[1]!.attributes('aria-pressed')).toBe('true')
    wrapper.unmount()
  })

  it('restores the space number when the label is cleared', async () => {
    const wrapper = await startRename(2)
    await wrapper.get('input').setValue('Trip')
    await wrapper.get('form').trigger('submit')
    await wrapper.findAll('.tag-bar button')[2]!.trigger('contextmenu')
    await wrapper.get('input').setValue('')
    await wrapper.get('input').trigger('blur')
    expect(wrapper.findAll('.tag-bar button')[2]!.text()).toBe('3')
    wrapper.unmount()
  })
})

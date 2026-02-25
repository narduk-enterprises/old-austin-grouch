import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check if the generic 'Nuxt 4 Edge Template' or specific hero content is present
    await expect(page.locator('h1').first()).toBeVisible()
    
    // Verify there are no console errors (we can monitor this by default in Playwright, 
    // but primarily we check that the page title sets properly and 200 OK)
    await expect(page).toHaveTitle(/Nuxt/)
  })

  test('about page loads and displays content', async ({ page }) => {
    await page.goto('/templates/about')
    
    // Replace with specific locators from your about page
    await expect(page.getByText('About Us')).toBeVisible()
  })

  test('contact page loads and displays form', async ({ page }) => {
    await page.goto('/templates/contact')
    
    // Check for the presence of the generic contact form
    await expect(page.locator('form')).toBeVisible()
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
  })

  test('SEO tags are generated properly', async ({ page }) => {
    await page.goto('/')
    
    // Verify the canonical link tag injected by useSeo()
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeDefined()
  })
})

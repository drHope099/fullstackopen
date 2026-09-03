const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database state
    await request.post('http://localhost:3003/api/testing/reset')

    // Create user in backend
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Hope Chacha',
        username: 'hopechacha59',
        password: 'password123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  // 5.17: Login form display
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  // 5.18: Login tests
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'hopechacha59', 'password123')
      await expect(page.getByText('Hope Chacha logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'hopechacha59', 'wrongpass')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Hope Chacha logged in')).not.toBeVisible()
    })
  })

 // Logged-in state context
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await loginWith(page, 'hopechacha59', 'password123')
    })

    // 5.19: Blog creation
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing Playwright E2E', 'Hope Chacha', 'https://playwright.dev')
      await expect(page.getByText('Testing Playwright E2E Hope Chacha').first()).toBeVisible()
    })

    // Single blog context
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Component vs E2E', 'Hope Chacha', 'https://fullstackopen.com')
      })

      // Liking a blog
      test('a blog can be liked', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'Component vs E2E' })
        await blog.getByRole('button', { name: 'view' }).click()
        await blog.getByRole('button', { name: 'like' }).click()
        await expect(blog.getByText('likes 1').first()).toBeVisible()
      })

      // Creator can delete blog
      test('the user who created the blog can delete it', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'Component vs E2E' })
        await blog.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await blog.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Component vs E2E Hope Chacha').first()).not.toBeVisible()
      })

      // Delete button visibility for non-creator
      test('only the creator sees the delete button', async ({ page, request }) => {
        // Create second user
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Second User',
            username: 'seconduser',
            password: 'password123'
          }
        })

        // Log out original creator
        await page.getByRole('button', { name: 'logout' }).click()

        // Log in as second user
        await loginWith(page, 'seconduser', 'password123')

        const blog = page.locator('.blog').filter({ hasText: 'Component vs E2E' })
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    // Blogs ordering by likes
    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First Blog Title', 'Hope Chacha', 'https://link1.com')
        await createBlog(page, 'Second Blog Title', 'Hope Chacha', 'https://link2.com')
        await createBlog(page, 'Third Blog Title', 'Hope Chacha', 'https://link3.com')
      })

      test('blogs are sorted by likes in descending order', async ({ page }) => {
        // Expand details for all blogs
        const viewButtons = page.getByRole('button', { name: 'view' })
        const count = await viewButtons.count()
        for (let i = 0; i < count; i++) {
          await viewButtons.nth(0).click()
        }

        // Like "Second Blog Title" 2 times
        const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog Title' })
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await secondBlog.getByText('likes 1').waitFor()
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await secondBlog.getByText('likes 2').waitFor()

        // Like "Third Blog Title" 1 time
        const thirdBlog = page.locator('.blog').filter({ hasText: 'Third Blog Title' })
        await thirdBlog.getByRole('button', { name: 'like' }).click()
        await thirdBlog.getByText('likes 1').waitFor()

        // Verify order in DOM
        const blogDivs = page.locator('.blog')
        await expect(blogDivs.nth(0)).toContainText('Second Blog Title')
        await expect(blogDivs.nth(1)).toContainText('Third Blog Title')
        await expect(blogDivs.nth(2)).toContainText('First Blog Title')
      })
    })
  })
})
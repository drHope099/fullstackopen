# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\blog_app.spec.js >> Blog app >> Login form is shown
- Location: tests\blog_app.spec.js:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('log in to application')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('log in to application')

```

# Test source

```ts
  1   | const { test, expect, beforeEach, describe } = require('@playwright/test')
  2   | const { loginWith, createBlog } = require('./helper')
  3   | 
  4   | describe('Blog app', () => {
  5   |   beforeEach(async ({ page, request }) => {
  6   |     // Reset database state
  7   |     await request.post('http://localhost:3003/api/testing/reset')
  8   | 
  9   |     // Create user in backend
  10  |     await request.post('http://localhost:3003/api/users', {
  11  |       data: {
  12  |         name: 'Hope Chacha',
  13  |         username: 'hopechacha59',
  14  |         password: 'password123'
  15  |       }
  16  |     })
  17  | 
  18  |     await page.goto('http://localhost:5173')
  19  |   })
  20  | 
  21  |   // 5.17: Login form display
  22  |   test('Login form is shown', async ({ page }) => {
> 23  |     await expect(page.getByText('log in to application')).toBeVisible()
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  24  |     await expect(page.getByLabel('username')).toBeVisible()
  25  |     await expect(page.getByLabel('password')).toBeVisible()
  26  |   })
  27  | 
  28  |   // 5.18: Login tests
  29  |   describe('Login', () => {
  30  |     test('succeeds with correct credentials', async ({ page }) => {
  31  |       await loginWith(page, 'hopechacha59', 'password123')
  32  |       await expect(page.getByText('Hope Chacha logged in')).toBeVisible()
  33  |     })
  34  | 
  35  |     test('fails with wrong credentials', async ({ page }) => {
  36  |       await loginWith(page, 'hopechacha59', 'wrongpass')
  37  | 
  38  |       const errorDiv = page.locator('.error')
  39  |       await expect(errorDiv).toContainText('wrong username or password')
  40  |       await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  41  |       await expect(page.getByText('Hope Chacha logged in')).not.toBeVisible()
  42  |     })
  43  |   })
  44  | 
  45  |  // Logged-in state context
  46  |   describe('When logged in', () => {
  47  |     beforeEach(async ({ page }) => {
  48  |       await page.goto('http://localhost:5173')
  49  |       await loginWith(page, 'hopechacha59', 'password123')
  50  |     })
  51  | 
  52  |     // 5.19: Blog creation
  53  |     test('a new blog can be created', async ({ page }) => {
  54  |       await createBlog(page, 'Testing Playwright E2E', 'Hope Chacha', 'https://playwright.dev')
  55  |       await expect(page.getByText('Testing Playwright E2E Hope Chacha').first()).toBeVisible()
  56  |     })
  57  | 
  58  |     // Single blog context
  59  |     describe('and a blog exists', () => {
  60  |       beforeEach(async ({ page }) => {
  61  |         await createBlog(page, 'Component vs E2E', 'Hope Chacha', 'https://fullstackopen.com')
  62  |       })
  63  | 
  64  |       // Liking a blog
  65  |       test('a blog can be liked', async ({ page }) => {
  66  |         const blog = page.locator('.blog').filter({ hasText: 'Component vs E2E' })
  67  |         await blog.getByRole('button', { name: 'view' }).click()
  68  |         await blog.getByRole('button', { name: 'like' }).click()
  69  |         await expect(blog.getByText('likes 1').first()).toBeVisible()
  70  |       })
  71  | 
  72  |       // Creator can delete blog
  73  |       test('the user who created the blog can delete it', async ({ page }) => {
  74  |         const blog = page.locator('.blog').filter({ hasText: 'Component vs E2E' })
  75  |         await blog.getByRole('button', { name: 'view' }).click()
  76  | 
  77  |         page.on('dialog', dialog => dialog.accept())
  78  |         await blog.getByRole('button', { name: 'remove' }).click()
  79  | 
  80  |         await expect(page.getByText('Component vs E2E Hope Chacha').first()).not.toBeVisible()
  81  |       })
  82  | 
  83  |       // Delete button visibility for non-creator
  84  |       test('only the creator sees the delete button', async ({ page, request }) => {
  85  |         // Create second user
  86  |         await request.post('http://localhost:3003/api/users', {
  87  |           data: {
  88  |             name: 'Second User',
  89  |             username: 'seconduser',
  90  |             password: 'password123'
  91  |           }
  92  |         })
  93  | 
  94  |         // Log out original creator
  95  |         await page.getByRole('button', { name: 'logout' }).click()
  96  | 
  97  |         // Log in as second user
  98  |         await loginWith(page, 'seconduser', 'password123')
  99  | 
  100 |         const blog = page.locator('.blog').filter({ hasText: 'Component vs E2E' })
  101 |         await blog.getByRole('button', { name: 'view' }).click()
  102 |         await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
  103 |       })
  104 |     })
  105 | 
  106 |     // Blogs ordering by likes
  107 |     describe('and multiple blogs exist', () => {
  108 |       beforeEach(async ({ page }) => {
  109 |         await createBlog(page, 'First Blog Title', 'Hope Chacha', 'https://link1.com')
  110 |         await createBlog(page, 'Second Blog Title', 'Hope Chacha', 'https://link2.com')
  111 |         await createBlog(page, 'Third Blog Title', 'Hope Chacha', 'https://link3.com')
  112 |       })
  113 | 
  114 |       test('blogs are sorted by likes in descending order', async ({ page }) => {
  115 |         // Expand details for all blogs
  116 |         const viewButtons = page.getByRole('button', { name: 'view' })
  117 |         const count = await viewButtons.count()
  118 |         for (let i = 0; i < count; i++) {
  119 |           await viewButtons.nth(0).click()
  120 |         }
  121 | 
  122 |         // Like "Second Blog Title" 2 times
  123 |         const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog Title' })
```
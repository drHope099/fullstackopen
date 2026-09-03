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

Locator: getByLabel('username')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByLabel('username')

```

```yaml
- heading "Log in to application" [level=2]
- text: username
- textbox
- text: password
- textbox
- button "login"
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
  23  |     await expect(page.getByText('log in to application')).toBeVisible()
> 24  |     await expect(page.getByLabel('username')).toBeVisible()
      |                                               ^ Error: expect(locator).toBeVisible() failed
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
  45  |   // Logged-in state context
  46  |   describe('When logged in', () => {
  47  |     beforeEach(async ({ page }) => {
  48  |       await loginWith(page, 'hopechacha59', 'password123')
  49  |     })
  50  | 
  51  |     // 5.19: Blog creation
  52  |     test('a new blog can be created', async ({ page }) => {
  53  |       await createBlog(page, 'Testing Playwright E2E', 'Hope Chacha', 'https://playwright.dev')
  54  |       await expect(page.getByText('Testing Playwright E2E Hope Chacha')).toBeVisible()
  55  |     })
  56  | 
  57  |     // Single blog context
  58  |     describe('and a blog exists', () => {
  59  |       beforeEach(async ({ page }) => {
  60  |         await createBlog(page, 'Component vs E2E', 'Hope Chacha', 'https://fullstackopen.com')
  61  |       })
  62  | 
  63  |       // 5.20: Liking a blog
  64  |       test('a blog can be liked', async ({ page }) => {
  65  |         await page.getByRole('button', { name: 'view' }).click()
  66  |         await page.getByRole('button', { name: 'like' }).click()
  67  |         await expect(page.getByText('likes 1')).toBeVisible()
  68  |       })
  69  | 
  70  |       // 5.21: Creator can delete blog
  71  |       test('the user who created the blog can delete it', async ({ page }) => {
  72  |         await page.getByRole('button', { name: 'view' }).click()
  73  | 
  74  |         page.on('dialog', dialog => dialog.accept())
  75  |         await page.getByRole('button', { name: 'remove' }).click()
  76  | 
  77  |         await expect(page.getByText('Component vs E2E Hope Chacha')).not.toBeVisible()
  78  |       })
  79  | 
  80  |       // 5.22: Delete button visibility for non-creator
  81  |       test('only the creator sees the delete button', async ({ page, request }) => {
  82  |         // Create second user
  83  |         await request.post('http://localhost:3003/api/users', {
  84  |           data: {
  85  |             name: 'Second User',
  86  |             username: 'seconduser',
  87  |             password: 'password123'
  88  |           }
  89  |         })
  90  | 
  91  |         // Log out original creator
  92  |         await page.getByRole('button', { name: 'logout' }).click()
  93  | 
  94  |         // Log in as second user
  95  |         await loginWith(page, 'seconduser', 'password123')
  96  | 
  97  |         await page.getByRole('button', { name: 'view' }).click()
  98  |         await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  99  |       })
  100 |     })
  101 | 
  102 |     // 5.23: Blogs ordering by likes
  103 |     describe('and multiple blogs exist', () => {
  104 |       beforeEach(async ({ page }) => {
  105 |         await createBlog(page, 'First Blog Title', 'Hope Chacha', 'https://link1.com')
  106 |         await createBlog(page, 'Second Blog Title', 'Hope Chacha', 'https://link2.com')
  107 |         await createBlog(page, 'Third Blog Title', 'Hope Chacha', 'https://link3.com')
  108 |       })
  109 | 
  110 |       test('blogs are sorted by likes in descending order', async ({ page }) => {
  111 |         // Expand details for all blogs
  112 |         const viewButtons = page.getByRole('button', { name: 'view' })
  113 |         const count = await viewButtons.count()
  114 |         for (let i = 0; i < count; i++) {
  115 |           await viewButtons.nth(0).click()
  116 |         }
  117 | 
  118 |         // Like "Second Blog Title" 2 times
  119 |         const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog Title' })
  120 |         await secondBlog.getByRole('button', { name: 'like' }).click()
  121 |         await secondBlog.getByText('likes 1').waitFor()
  122 |         await secondBlog.getByRole('button', { name: 'like' }).click()
  123 |         await secondBlog.getByText('likes 2').waitFor()
  124 | 
```
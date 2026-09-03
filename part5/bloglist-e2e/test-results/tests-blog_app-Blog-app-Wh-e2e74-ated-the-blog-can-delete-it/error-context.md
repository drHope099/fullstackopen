# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\blog_app.spec.js >> Blog app >> When logged in >> and a blog exists >> the user who created the blog can delete it
- Location: tests\blog_app.spec.js:71:7

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'create new blog' })

```

```
Error: locator.fill: Test ended.
Call log:
  - waiting for getByLabel('username')

```

# Test source

```ts
  1  | const loginWith = async (page, username, password) => {
> 2  |   await page.getByLabel('username').fill(username)
     |                                     ^ Error: locator.fill: Test ended.
  3  |   await page.getByLabel('password').fill(password)
  4  |   await page.getByRole('button', { name: 'login' }).click()
  5  | }
  6  | 
  7  | const createBlog = async (page, title, author, url) => {
  8  |   await page.getByRole('button', { name: 'create new blog' }).click()
  9  |   await page.getByPlaceholder('title').fill(title)
  10 |   await page.getByPlaceholder('author').fill(author)
  11 |   await page.getByPlaceholder('url').fill(url)
  12 |   await page.getByRole('button', { name: 'create' }).click()
  13 |   await page.getByText(`${title} ${author}`).waitFor()
  14 | }
  15 | 
  16 | export { loginWith, createBlog }
```
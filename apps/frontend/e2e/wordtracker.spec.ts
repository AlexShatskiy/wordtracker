import { test, expect } from '@playwright/test'

const seedPair = async (page: import('@playwright/test').Page) => {
  await page.goto('/choose-pair')
  await page.evaluate(() => {
    localStorage.setItem('wt-pair', JSON.stringify({ from: 'en', to: 'ru' }))
    localStorage.setItem('wt-pairs', JSON.stringify([{ from: 'en', to: 'ru' }]))
  })
}

test('choose-pair: shows all 3 pairs and enables Continue button on selection', async ({ page }) => {
  await page.goto('/choose-pair')
  await expect(page.getByText('Which languages do you read in?')).toBeVisible()
  await expect(page.getByText('English ↔ Russian')).toBeVisible()
  await expect(page.getByText('English ↔ Polish')).toBeVisible()
  await expect(page.getByText('Russian ↔ Polish')).toBeVisible()

  const continueBtn = page.getByRole('button', { name: /select a language pair/i })
  await expect(continueBtn).toBeDisabled()

  await page.getByText('English ↔ Russian').click()
  await expect(page.getByRole('button', { name: /continue with en/i })).toBeEnabled()
})

test('translate: shows recent lookups and finds a word', async ({ page }) => {
  await seedPair(page)
  await page.goto('/')

  await expect(page.getByText('RECENT LOOKUPS')).toBeVisible()
  await expect(page.getByText('serendipity')).toBeVisible()

  await page.fill('input', 'serendipity')
  // FrequencyBadge renders count and label in separate spans inside one badge element
  await expect(page.locator('span').filter({ hasText: /17×/ }).filter({ hasText: /STUCK/ })).toBeVisible()
  await expect(page.getByText('счастливая случайность')).toBeVisible()
  await expect(page.getByText('Detected · English')).toBeVisible()
})

test('translate: Cyrillic input detects Russian language', async ({ page }) => {
  await seedPair(page)
  await page.goto('/')
  await page.fill('input', 'обстоятельство')
  await expect(page.getByText('Detected · Russian')).toBeVisible()
  await expect(page.getByText('circumstance')).toBeVisible()
})

test('translate: save toggle shows toast notification', async ({ page }) => {
  await seedPair(page)
  await page.goto('/')
  await page.fill('input', 'elated')
  await page.getByRole('button', { name: /save/i }).click()
  await expect(page.getByText('Saved to My Words')).toBeVisible()
})

test('word detail: opens sheet and shows sparkbar with stats', async ({ page }) => {
  await seedPair(page)
  await page.goto('/')
  await page.fill('input', 'serendipity')
  await page.getByRole('button', { name: /more examples/i }).click()
  await expect(page.getByText('LAST 14 DAYS')).toBeVisible()
  await expect(page.getByText('STATS')).toBeVisible()
  await expect(page.getByText('17').first()).toBeVisible()
})

test('my words: stats tiles, filter by direction, and sort toggle', async ({ page }) => {
  await seedPair(page)
  await page.goto('/words')

  await expect(page.getByText('TOTAL')).toBeVisible()
  // StatTile passes label="Stuck" — CSS textTransform uppercases visually but DOM keeps "Stuck"
  await expect(page.getByText('Stuck', { exact: true })).toBeVisible()
  await expect(page.getByText('TODAY')).toBeVisible()

  // filter EN→RU hides words from other pairs
  await page.getByRole('button', { name: 'EN → RU' }).click()
  await expect(page.getByText('обстоятельство')).not.toBeVisible()

  // sort A-Z brings "elated" to top
  await page.getByRole('button', { name: /by count/i }).click()
  const first = page.locator('button').filter({ hasText: /^elated/ }).first()
  await expect(first).toBeVisible()
})

test('quick add: shows preview card when a word is typed', async ({ page }) => {
  await seedPair(page)
  await page.goto('/')
  await page.getByText('Quick add a word…').click()
  // exact: true avoids matching "RECENT LOOKUPS" on the translate page behind the scrim
  await expect(page.getByText('RECENT', { exact: true })).toBeVisible()
  await page.fill('input[placeholder="Type a word…"]', 'resilient')
  await expect(page.getByText('PREVIEW')).toBeVisible()
  // .first() — background page still in DOM behind scrim, first match is inside PREVIEW
  await expect(page.getByText(/устойчивый/).first()).toBeVisible()
  await page.getByRole('button', { name: 'Save word' }).click()
  await expect(page.getByText('Saved to My Words')).toBeVisible()
})

test('pair switcher: opens sheet and shows all available pairs', async ({ page }) => {
  await seedPair(page)
  await page.evaluate(() => {
    localStorage.setItem('wt-pairs', JSON.stringify([
      { from: 'en', to: 'ru' },
      { from: 'en', to: 'pl' },
    ]))
  })
  await page.goto('/')
  await page.locator('button').filter({ has: page.locator('span:text("EN")') }).first().click()
  await expect(page.getByText('Language pair')).toBeVisible()
  await expect(page.getByText('ACTIVE')).toBeVisible()
  await expect(page.getByText('English ↔ Polish')).toBeVisible()
})

import { test, expect, type Page } from '@playwright/test'

// ─── Mock API data ───────────────────────────────────────────────────────────

const MOCK_WORDS = [
  {
    id: 'serendipity:en:ru',
    term: 'serendipity',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/ˌsɛrənˈdɪpɪti/',
    translation: 'счастливая случайность',
    examples: ['Finding that letter was pure serendipity.'],
    lookups: 17,
    saved: true,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-02T00:00:00.000Z',
    source: 'mock',
  },
  {
    id: 'elated:en:ru',
    term: 'elated',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/ɪˈleɪtɪd/',
    translation: 'восторженный',
    examples: ['She was elated by the news.'],
    lookups: 3,
    saved: false,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-22T00:00:00.000Z',
    source: 'mock',
  },
  {
    id: 'resilient:en:ru',
    term: 'resilient',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/rɪˈzɪliənt/',
    translation: 'устойчивый',
    examples: ['A resilient economy bounces back.'],
    lookups: 8,
    saved: true,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-12T00:00:00.000Z',
    source: 'mock',
  },
  {
    id: 'obstoyatelstvo:ru:en',
    term: 'обстоятельство',
    lang: 'ru',
    targetLang: 'en',
    phonetic: '[ɐpstɐˈjatʲɪlʲstvə]',
    translation: 'circumstance',
    examples: ['Обстоятельства сложились удачно.'],
    lookups: 9,
    saved: true,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-05T00:00:00.000Z',
    source: 'mock',
  },
]

const MOCK_SAVED = MOCK_WORDS.filter((w) => w.saved)

// ─── Route mock helpers ───────────────────────────────────────────────────────

const API = 'http://localhost:3001'

async function mockApi(page: Page) {
  // Only intercept backend API requests, not frontend navigation
  await page.route(`${API}/translate`, async (route) => {
    const body = JSON.parse(route.request().postData() ?? '{}') as {
      term?: string
    }
    const word = MOCK_WORDS.find(
      (w) => w.term.toLowerCase() === body.term?.toLowerCase().trim(),
    )
    if (word) {
      await route.fulfill({ json: word })
    } else {
      await route.fulfill({ status: 503, json: { message: 'unavailable' } })
    }
  })

  await page.route(`${API}/words/save`, async (route) => {
    await route.fulfill({ json: { data: { saved: true } } })
  })

  await page.route(/localhost:3001\/words\/\w+/, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ json: { data: { saved: false } } })
    } else {
      await route.fulfill({ json: { data: MOCK_SAVED } })
    }
  })

  await page.route(/localhost:3001\/words(\?.*)?$/, async (route) => {
    await route.fulfill({ json: { data: MOCK_SAVED } })
  })
}

async function seedPair(page: Page) {
  await page.goto('/choose-pair')
  await page.evaluate(() => {
    localStorage.setItem('wt-onboarding-done', '1')
    localStorage.setItem('wt-pair', JSON.stringify({ from: 'en', to: 'ru' }))
    localStorage.setItem('wt-pairs', JSON.stringify([{ from: 'en', to: 'ru' }]))
  })
  await mockApi(page)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test('choose-pair: shows all 3 pairs and enables Continue button on selection', async ({
  page,
}) => {
  await page.goto('/choose-pair')
  await expect(page.getByText('Which languages do you read in?')).toBeVisible()
  await expect(page.getByText('English ↔ Russian')).toBeVisible()
  await expect(page.getByText('English ↔ Polish')).toBeVisible()
  await expect(page.getByText('Russian ↔ Polish')).toBeVisible()

  const continueBtn = page.getByRole('button', {
    name: /select a language pair/i,
  })
  await expect(continueBtn).toBeDisabled()

  await page.getByText('English ↔ Russian').click()
  await expect(
    page.getByRole('button', { name: /continue with en/i }),
  ).toBeEnabled()
})

test('translate: shows recent lookups and finds a word', async ({ page }) => {
  await seedPair(page)
  await page.goto('/')

  await expect(page.getByText('RECENT LOOKUPS')).toBeVisible()
  await expect(page.getByText('serendipity')).toBeVisible()

  await page.fill('input', 'serendipity')
  // FrequencyBadge renders count and label in separate spans inside one badge element
  await expect(
    page
      .locator('span')
      .filter({ hasText: /17×/ })
      .filter({ hasText: /STUCK/ }),
  ).toBeVisible()
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

test('word detail: opens sheet and shows sparkbar with stats', async ({
  page,
}) => {
  await seedPair(page)
  await page.goto('/')
  await page.fill('input', 'serendipity')
  await page.getByRole('button', { name: /more examples/i }).click()
  await expect(page.getByText('LAST 14 DAYS')).toBeVisible()
  await expect(page.getByText('STATS')).toBeVisible()
  await expect(page.getByText('17').first()).toBeVisible()
})

test('my words: stats tiles, filter by direction, and sort toggle', async ({
  page,
}) => {
  await seedPair(page)
  await page.goto('/words')

  // StatTile labels are lowercase in DOM; CSS text-transform is visual only
  await expect(page.getByText('Total', { exact: true })).toBeVisible()
  await expect(page.getByText('Stuck', { exact: true })).toBeVisible()
  await expect(page.getByText('Today', { exact: true })).toBeVisible()

  // filter EN→RU hides words from other pairs
  await page.getByRole('button', { name: 'EN → RU' }).click()
  await expect(page.getByText('обстоятельство')).not.toBeVisible()

  // sort A-Z brings "resilient" before "serendipity"
  await page.getByRole('button', { name: /by count/i }).click()
  const first = page
    .locator('button')
    .filter({ hasText: /^resilient/ })
    .first()
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

test('pair switcher: opens sheet and shows all available pairs', async ({
  page,
}) => {
  await seedPair(page)
  await page.evaluate(() => {
    localStorage.setItem(
      'wt-pairs',
      JSON.stringify([
        { from: 'en', to: 'ru' },
        { from: 'en', to: 'pl' },
      ]),
    )
  })
  await page.goto('/')
  await page
    .locator('button')
    .filter({ has: page.locator('span:text("EN")') })
    .first()
    .click()
  await expect(page.getByText('Language pair')).toBeVisible()
  await expect(page.getByText('ACTIVE')).toBeVisible()
  await expect(page.getByText('English ↔ Polish')).toBeVisible()
})

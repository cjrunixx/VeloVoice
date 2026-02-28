/**
 * 🧪 E2E TESTS — VeloVoice User Flows (Playwright)
 * Simulates real user interactions in a headless browser.
 * NOTE: Ensure both dev servers are running before running these:
 *   - Frontend: http://localhost:5173
 *   - Backend:  ws://localhost:3001
 */
import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';

// Helper: Wait for startup animation to finish
async function waitForApp(page) {
    // The startup animation runs ~3.5s — wait for the main layout
    await page.waitForSelector('aside', { timeout: 10000 });
}

// -----------------------------------------------------------------
// 1. APP LOADS & STARTUP ANIMATION
// -----------------------------------------------------------------
test.describe('🚀 Startup & Boot Sequence', () => {
    test('should show startup screen then transition to dashboard', async ({ page }) => {
        await page.goto(APP_URL);
        // Startup screen canvas should be visible immediately
        await expect(page.locator('canvas')).toBeVisible();
        // After animation, sidebar nav should appear
        await waitForApp(page);
        await expect(page.locator('aside')).toBeVisible();
    });

    test('should display system check steps during boot', async ({ page }) => {
        await page.goto(APP_URL);
        // Check for one of the boot labels
        await expect(page.getByText(/GPS Signal/i)).toBeVisible({ timeout: 5000 });
    });
});

// -----------------------------------------------------------------
// 2. NAVIGATION — View Switching
// -----------------------------------------------------------------
test.describe('🗂️ Navigation Bar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
        await waitForApp(page);
    });

    test('should switch to Vehicle Status view', async ({ page }) => {
        // Click the Car/Vehicle icon (2nd nav button)
        const navButtons = page.locator('aside button');
        await navButtons.nth(1).click();
        // Vehicle status should show tire / battery info
        await expect(page.getByText(/Battery/i)).toBeVisible({ timeout: 3000 });
    });

    test('should switch to Controls view', async ({ page }) => {
        const navButtons = page.locator('aside button');
        await navButtons.nth(2).click();
        await expect(page.getByText(/Engine|Climate/i)).toBeVisible({ timeout: 3000 });
    });

    test('should switch to Phone view', async ({ page }) => {
        const navButtons = page.locator('aside button');
        await navButtons.nth(3).click();
        await expect(page.getByText(/Recents|Contacts/i)).toBeVisible({ timeout: 3000 });
    });

    test('should switch to Settings view', async ({ page }) => {
        const navButtons = page.locator('aside button');
        await navButtons.nth(4).click();
        await expect(page.getByText(/Accent Color|Persona/i)).toBeVisible({ timeout: 3000 });
    });
});

// -----------------------------------------------------------------
// 3. CONTROLS — Car Feature Toggles
// -----------------------------------------------------------------
test.describe('🎛️ Car Controls', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
        await waitForApp(page);
        const navButtons = page.locator('aside button');
        await navButtons.nth(2).click();
    });

    test('should toggle Engine on and off', async ({ page }) => {
        const engineBtn = page.getByText('Engine').locator('..');
        await engineBtn.click();
        // After click, button should show "On" state
        await expect(page.getByText('On').first()).toBeVisible({ timeout: 2000 });
        await engineBtn.click();
        await expect(page.getByText('Off').first()).toBeVisible({ timeout: 2000 });
    });
});

// -----------------------------------------------------------------
// 4. MEDIA — Play/Pause
// -----------------------------------------------------------------
test.describe('🎵 Media Player', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
        await waitForApp(page);
    });

    test('should toggle play/pause on media card', async ({ page }) => {
        // Dashboard is the default view (home)
        // Find the play button in the media card
        const playBtn = page.locator('div[style*="border-radius: 50%"]').first();
        await playBtn.click();
        // Progress bar should start moving — just verify the click doesn't crash
        await page.waitForTimeout(1500);
        // No errors (implicit check by remaining on page)
        await expect(page.locator('aside')).toBeVisible();
    });
});

// -----------------------------------------------------------------
// 5. SETTINGS — Accent Color Change
// -----------------------------------------------------------------
test.describe('⚙️ Settings', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
        await waitForApp(page);
        const navButtons = page.locator('aside button');
        await navButtons.nth(4).click();
    });

    test('should show persona selector', async ({ page }) => {
        await expect(page.getByText(/Samantha|Jarvis|KITT/i)).toBeVisible({ timeout: 3000 });
    });
});

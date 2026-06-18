import { test, expect } from '@playwright/test';

test('home renders the Building QR screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '링크를 빌딩숲으로' })).toBeVisible();
  await expect(page.getByLabel('링크 또는 텍스트')).toBeVisible();
});

test('sample link generates the preview, export panel, and presets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '샘플 링크' }).click();

  await expect(page.getByLabel('링크 또는 텍스트')).not.toHaveValue('');
  // export panel + presets appear once a matrix exists
  await expect(page.getByRole('button', { name: 'PNG 저장' })).toBeVisible();
  await expect(page.getByRole('radio', { name: '황혼 도시' })).toBeVisible();
  // the viewport renders something (3D host or 2D fallback)
  await expect(page.getByRole('img', { name: /빌딩숲|QR/ }).first()).toBeVisible();
});

test('view switch toggles 3D <-> 2D', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '샘플 링크' }).click();
  const toggle = page.getByRole('switch', { name: /3D.*2D/ });
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
});

test('footer navigates to the privacy page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '개인정보' }).click();
  await expect(page.getByRole('heading', { name: '개인정보 처리방침' })).toBeVisible();
});

test('long input shows a reliability warning', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('링크 또는 텍스트').fill('https://example.com/' + 'a'.repeat(120));
  await expect(page.getByText(/권장|길어/)).toBeVisible();
});

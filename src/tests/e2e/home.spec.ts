import { test, expect } from '@playwright/test';

test('home renders the Building QR screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '링크를 빌딩숲으로' })).toBeVisible();
  await expect(page.getByLabel('링크 또는 텍스트')).toBeVisible();
});

test('sample link button fills the input', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '샘플 링크' }).click();
  await expect(page.getByLabel('링크 또는 텍스트')).not.toHaveValue('');
});

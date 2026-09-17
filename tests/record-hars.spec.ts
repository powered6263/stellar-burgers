import { test, expect } from '@playwright/test';

test('Запись HAR-файлов', async ({ context, page }) => {

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOTAyZTIxNmExNzJkMDAxYjk5MzRjOSIsImlhdCI6MTc4OTYyNzk3NCwiZXhwIjoxNzg5NjI5MTc0fQ.FHnTzg5WFBfM7FVb0f84n6WCvfxa4-qXR14RxDxn9nk',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', '653b925d7ee3f53f40f235295368014f47d44e99ccfcec8ac17ba620fedbb3bb393d67bb3d55213b');
    });

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false,
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients-list')).toBeVisible();

    const bun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
    const ingredient = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093f');
    await expect(bun).toBeVisible();
    await expect(ingredient).toBeVisible();
    await bun.getByRole('button', { name: 'Добавить' }).click();
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    const orderButton = page.getByTestId('order-bottom');
    await expect(orderButton).toBeVisible();
    await orderButton.click();
    await expect(page.getByTestId('order-number')).toBeVisible({ timeout: 20000 });
  });
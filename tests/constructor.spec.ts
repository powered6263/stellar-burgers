import { test, expect } from '@playwright/test';

test.beforeEach('Запись/воспроизведение HAR-файла с ингредиентами', async ({ page }) => {
    
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.goto('/');
  
  await expect(page.getByTestId('ingredients-list')).toBeVisible();
  
});

test.describe('Тест: конструктор бургера', () => {

  test('Конструктор пуст в начале', async ({ page }) => {
    await expect(page.getByTestId('constructor-bun-empty-top')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-empty-bottom')).toBeVisible();
    await expect(page.getByTestId('constructor-ingredients-empty')).toBeVisible();
  });

  test('Добавление булки', async ({ page }) => {
    const bun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
    await expect(bun).toBeVisible();
    await bun.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-bun-top')).toContainText('Краторная булка N-200i (верх)');
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText('Краторная булка N-200i (низ)');
  });

  test('Добавление начинки', async ({ page }) => {
    const ingredient = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093f');
    await expect(ingredient).toBeVisible();
    await ingredient.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-ingredients')).toContainText('Мясо бессмертных моллюсков Protostomia');
  });

});

test.describe('Тест: модальное окно ингредиента', () => {

  test.beforeEach('Открытие модального окна', async ({ page }) => {
    const ingredient = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093f');
    const ingredientLink = ingredient.getByTestId('ingredient-link');
    await expect(ingredientLink).toBeVisible();
    await ingredientLink.click();
  });

  test('Проверка открытия модального окна', async ({ page }) => {
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Мясо бессмертных моллюсков Protostomia');
  });

  test('Проверка закрытия модального окна на крестик', async ({ page }) => {
    const modalCloseIcon = page.getByTestId('modal-close-icon');
    await expect(modalCloseIcon).toBeVisible();
    await modalCloseIcon.click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Проверка закрытия модального окна на оверлей', async ({ page }) => {
    const modalOverlay = page.getByTestId('modal-overlay');
    await expect(modalOverlay).toBeVisible();
    await modalOverlay.click({ position: { x: 1, y: 1 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

});

test.describe('Тест: создание заказа', () => {
  
  test.beforeEach(async ({ context, page }) => {
    // Моковые данные ответа на запрос данных пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.ru', name: 'Тест' },
        }),
      });
    });

    // Моковые данные ответа на запрос создания заказа
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: { number: 987654321 },
        }),
      });
    });

    // Моковые токены авторизации (Cookies)
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Моковые токены авторизации (LocalStorage)
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    // Запуск страницы
    await page.goto('/');
    await expect(page.getByTestId('ingredients-list')).toBeVisible();
    
    // Сборка бургера
    const bun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
    const ingredient = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093f');
    await expect(bun).toBeVisible();
    await expect(ingredient).toBeVisible();
    await bun.getByRole('button', { name: 'Добавить' }).click();
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

  });

  test('Проверка собранного бургера', async ({ page }) => {
    await expect(page.getByTestId('constructor-bun-top')).toContainText('Краторная булка N-200i (верх)');
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText('Краторная булка N-200i (низ)');
    await expect(page.getByTestId('constructor-ingredients')).toContainText('Мясо бессмертных моллюсков Protostomia');
  });

  test('Открытие модального окна заказа', async ({ page }) => {
    const orderButton = page.getByTestId('order-bottom');
    await expect(orderButton).toBeVisible();
    await orderButton.click();
    await expect(page.getByTestId('order-number')).toContainText('987654321', { timeout: 10000 });
  });

  test('Очистка конструктора после заказа', async ({ page }) => {
    const orderButton = page.getByTestId('order-bottom');
    await expect(orderButton).toBeVisible();
    await orderButton.click();
    await expect(page.getByTestId('constructor-bun-empty-top')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('constructor-bun-empty-bottom')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('constructor-ingredients-empty')).toBeVisible({ timeout: 10000 });
  });

  test('Зткрытие модального окна заказа', async ({ page }) => {
    const orderButton = page.getByTestId('order-bottom');
    await expect(orderButton).toBeVisible();
    await orderButton.click();
    const modalCloseIcon = page.getByTestId('modal-close-icon');
    await expect(modalCloseIcon).toBeVisible();
    await modalCloseIcon.click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

});

  

import reducer, { initialState, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тест редюсера ingredientsSlice', () => {

    const mockIngredients: TIngredient[] = [
    {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
    ];

    const mockError = 'Ошибка';
  
    test('Обработка экшена fetchIngredients.pending', () => {

        const newState = reducer(initialState, fetchIngredients.pending('', undefined));

        expect(newState.isIngredientsLoading).toBe(true);
        
        expect(newState.error).toBe(null);
    });

    test('Обработка экшена fetchIngredients.rejected', () => {

        const newState = reducer(initialState, fetchIngredients.rejected(new Error(mockError), '', undefined));

        expect(newState.isIngredientsLoading).toBe(false);

        expect(newState.error).toEqual(mockError);
    });

    test('Обработка экшена fetchIngredients.fulfilled', () => {

        const newState = reducer(initialState, fetchIngredients.fulfilled(mockIngredients, '', undefined));

        expect(newState).toEqual({
            ...initialState,
            ingredients: mockIngredients,
            isIngredientsLoading: false,
            error: null
        });
    });

    test('Обработка неизвестного экшена', () => {

        const newState = reducer(undefined, { type: 'UNKNOWN' });

        expect(newState).toEqual(initialState);
    });
});

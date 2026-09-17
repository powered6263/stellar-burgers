import reducer, { initialState, addIngredient, removeIngredient, moveIngredient, clearConstructor } from '../burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('Тест редюсера burgerConstructorSlice', () => {

    const mockIngredients: TConstructorIngredient[] = [
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
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        id: 'bun-1'
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
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: 'main-1'
    },
    {
        _id: '643d69a5c3f7b9001cfa0945',
        name: 'Соус с шипами Антарианского плоскоходца',
        type: 'sauce',
        proteins: 101,
        fat: 99,
        carbohydrates: 100,
        calories: 100,
        price: 88,
        image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
        id: 'sauce-1'
    }
    ];

    test('Обработка экшена addIngredient для булок', () => {

        const newState = reducer(initialState, addIngredient(mockIngredients[0]));

        expect(newState.bun).toEqual(mockIngredients[0]);
        expect(newState.ingredients).toEqual([]);

    });

    test('Обработка экшена addIngredient для начинок', () => {

        const newState = reducer(initialState, addIngredient(mockIngredients[1]));

        expect(newState.ingredients).toEqual([mockIngredients[1]]);
        expect(newState.bun).toEqual(null);

    });

    test('Обработка экшена removeIngredient', () => {

        const initialTestState = {
            ...initialState,
            bun: mockIngredients[0],
            ingredients: [mockIngredients[1], mockIngredients[2]]
        }

        const newState = reducer(initialTestState, removeIngredient(mockIngredients[1].id));

        expect(newState).toEqual({
            bun: mockIngredients[0],
            ingredients: [mockIngredients[2]]
        });

    });

    test('Обработка экшена moveIngredient', () => {

        const initialTestState = {
            ...initialState,
            bun: mockIngredients[0],
            ingredients: [mockIngredients[1], mockIngredients[2]]
        }

        const newState = reducer(initialTestState, moveIngredient({from: 1, to: 0}));

        expect(newState).toEqual({
            bun: mockIngredients[0],
            ingredients: [mockIngredients[2], mockIngredients[1]]
        });

    });

    test('Обработка экшена clearConstructor', () => {

        const initialTestState = {
            ...initialState,
            bun: mockIngredients[0],
            ingredients: [mockIngredients[1], mockIngredients[2]]
        }

        const newState = reducer(initialTestState, clearConstructor());

        expect(newState).toEqual({
            bun: null,
            ingredients: []
        });

    });

    test('Обработка неизвестного экшена', () => {

        const newState = reducer(undefined, { type: 'UNKNOWN' });

        expect(newState).toEqual(initialState);

    });

})
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSliceReducer from '../slices/ingredientsSlice';
import burgerConstructorReducer from '../slices/burgerConstructorSlice';
import orderReducer from '../slices/orderSlice';
import feedReducer from '../slices/feedSlice';
import userReducer from '../slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer
});

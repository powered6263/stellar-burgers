import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface orderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  ordersHistory: TOrder[];
  isLoading: boolean;
  error: null | string | undefined;
}

const initialState: orderState = {
  orderRequest: false,
  orderModalData: null,
  ordersHistory: [],
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return {
      ...response.order,
      ingredients: data
    };
  }
);

export const fetchOrdersHistory = createAsyncThunk(
  'order/fetchOrdersHistory',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrdersHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersHistory = action.payload;
      })
      .addCase(fetchOrdersHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки истории';
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;

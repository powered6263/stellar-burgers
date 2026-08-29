import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrdersHistory } from '../../services/slices/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { ordersHistory, isLoading, error } = useSelector(
    (state) => state.order
  );
  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <ProfileOrdersUI orders={ordersHistory} />;
};

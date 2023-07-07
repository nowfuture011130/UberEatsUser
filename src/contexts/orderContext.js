import { createContext, useContext, useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Order, OrderDish, Basket, BasketDish, Restaurant } from "../models";
import { useAuthContext } from "./AuthContext";
import { useBasketContext } from "./basketContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();
  const { restaurant, totalPrice, basketDishes, basket } = useBasketContext();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (dbUser)
      DataStore.query(Order, (o) => o.user2ID.eq(dbUser.id)).then(setOrders);
  }, [dbUser]);

  const getOrder = async (id) => {
    const order = await DataStore.query(Order, id);
    const orderDish = await DataStore.query(OrderDish, (od) =>
      od.orderID.eq(id)
    );
    const rest = await DataStore.query(Restaurant, order.orderRestaurantId);
    return { ...order, dishes: orderDish, Restaurant: rest };
  };

  const createOrder = async () => {
    const newOrder = await DataStore.save(
      new Order({
        user2ID: dbUser.id,
        Restaurant: restaurant,
        status: "NEW",
        total: totalPrice,
      })
    );

    await Promise.all(
      basketDishes.map((basketDish) =>
        DataStore.save(
          new OrderDish({
            quantity: basketDish.quantity,
            orderID: newOrder.id,
            orderDishDishId: basketDish.dishID,
          })
        )
      )
    ).then(DataStore.delete(basket));

    setOrders([...orders, newOrder]);
  };
  return (
    <OrderContext.Provider value={{ createOrder, orders, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);

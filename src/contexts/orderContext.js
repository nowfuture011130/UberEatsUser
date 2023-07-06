import { createContext, useContext, useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Order, OrderDish, Basket, BasketDish } from "../models";
import { useAuthContext } from "./AuthContext";
import { useBasketContext } from "./basketContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();
  const { restaurant, totalPrice, basketDishes, basket } = useBasketContext();

  const createOrder = async () => {
    //     const newOrder = await DataStore.save(
    //       new Order({
    //         user2ID: dbUser.id,
    //         Restaurant: restaurant,
    //         status: "NEW",
    //         total: totalPrice,
    //       })
    //     );

    // await Promise.all(
    //   basketDishes.map((basketDish) =>
    //     DataStore.save(
    //       new OrderDish({
    //         quantity: basketDish.quantity,
    //         orderID: newOrder.id,
    //         Dish: basketDish.Dish,
    //       })
    //     )
    //   )
    // );

    await Promise.all(
      basketDishes.map((basketDish) =>
        DataStore.save(
          BasketDish.copyOf(basketDish, (updated) => {
            updated.Dish = null;
          })
        )
      )
    ).then(DataStore.delete(basket));
    // DataStore.save(
    //   Basket.copyOf(toDelete, (updated) => {
    //     updated.restaurantID = "clear";
    //   })
    // );
    console.log(dbUser);
    console.log();
    console.log(basketDishes);
    // console.warn(11);
  };
  return (
    <OrderContext.Provider value={{ createOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);

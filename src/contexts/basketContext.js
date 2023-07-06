import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from "@aws-amplify/datastore";
import "@azure/core-asynciterator-polyfill";
import { Basket, BasketDish } from "../models";
import { useAuthContext } from "./AuthContext";

const Context = createContext({});

const basketContext = ({ children }) => {
  const { dbUser } = useAuthContext();
  const [restaurant, setRestaurant] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);

  useEffect(() => {
    if (restaurant)
      DataStore.query(Basket, (a) =>
        a.and((a) => [
          a.restaurantID.eq(restaurant.id),
          a.user2ID.eq(dbUser.id),
        ])
      ).then((basket) => setBasket(basket[0]));
  }, [dbUser, restaurant]);

  useEffect(() => {
    if (basket) {
      DataStore.query(BasketDish, (bd) => bd.basketID.eq(basket.id)).then(
        setBasketDishes
      );
    }
  }, [basket]);

  const createNewBasket = async () => {
    const newbasket = await DataStore.save(
      new Basket({ user2ID: dbUser.id, restaurantID: restaurant.id })
    );
    setBasket(newbasket);
    return newbasket;
  };

  const addDishToBasket = async (dish, quantity) => {
    let theBasket = basket || (await createNewBasket());

    const newDish = await DataStore.save(
      new BasketDish({ quantity, Dish: dish, basketID: theBasket.id })
    );
    setBasketDishes([...basketDishes, newDish]);
  };

  return (
    <Context.Provider
      value={{
        restaurant,
        addDishToBasket,
        setRestaurant,
        basket,
        basketDishes,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default basketContext;

export const useBasketContext = () => useContext(Context);

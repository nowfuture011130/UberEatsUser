import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from "@aws-amplify/datastore";
import "@azure/core-asynciterator-polyfill";
import { Basket, BasketDish, Dish } from "../models";
import { useAuthContext } from "./AuthContext";

const Context = createContext({});

const basketContext = ({ children }) => {
  const { dbUser } = useAuthContext();
  const [restaurant, setRestaurant] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const getTotalPrice = async () => {
    let totalprice = restaurant?.deliveryFee;
    for (let i = 0; i < basketDishes.length; ++i) {
      const theDish = await DataStore.query(Dish, (c) =>
        c.id.eq(basketDishes[i].dishID)
      );
      totalprice += theDish[0].price * basketDishes[i].quantity;
    }
    setTotalPrice(totalprice);
  };

  // useEffect(() => {
  //   const sub = DataStore.observeQuery(Basket, (c) =>
  //     c.id.eq(basket.id)
  //   ).subscribe(({ items }) => {
  //     setBasket(items[0]);
  //   });

  //   return () => {
  //     sub.unsubscribe();
  //   };
  // }, []);

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
  }, [basket, basketDishes]);

  useEffect(() => {
    getTotalPrice();
  }, [basketDishes]);

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
      new BasketDish({ quantity, dishID: dish.id, basketID: theBasket.id })
    );
    if (basket) {
      DataStore.query(BasketDish, (bd) => bd.basketID.eq(basket.id)).then(
        setBasketDishes
      );
    }
    // getTotalPrice();
  };

  return (
    <Context.Provider
      value={{
        restaurant,
        addDishToBasket,
        setRestaurant,
        basket,
        basketDishes,
        totalPrice,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default basketContext;

export const useBasketContext = () => useContext(Context);

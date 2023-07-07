import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Dish, BasketDish } from "../../models";
import { MaterialIcons } from "@expo/vector-icons";
const BasketDishItem = ({ basketDish }) => {
  const [dish, setDish] = useState(null);

  const getDish = async () => {
    if (basketDish.dishID) {
      const theDish = await DataStore.query(Dish, (c) =>
        c.id.eq(basketDish.dishID)
      ).then((dish) => setDish(dish[0]));
    } else {
      const theDish = await DataStore.query(Dish, (c) =>
        c.id.eq(basketDish.orderDishDishId)
      ).then((dish) => setDish(dish[0]));
    }
  };

  const deletePress = () => {
    DataStore.delete(basketDish);
  };

  useEffect(() => {
    getDish();
  }, [basketDish]);

  return (
    <View style={styles.row}>
      {basketDish.dishID && (
        <MaterialIcons
          name="delete"
          size={24}
          color="black"
          onPress={deletePress}
          style={{ paddingRight: 8 }}
        />
      )}
      <View style={styles.quantityContainer}>
        <Text>{basketDish.quantity}</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>{dish?.name}</Text>
      <Text style={{ marginLeft: "auto" }}>
        $ {(dish?.price * basketDish.quantity).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },

  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 3,
  },
});

export default BasketDishItem;

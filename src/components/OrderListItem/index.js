import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "@aws-amplify/datastore";
import { Restaurant } from "../../models";
import { useEffect, useState } from "react";

const OrderListItem = ({ order }) => {
  const navigation = useNavigation();

  const [restaurant, setRestaurant] = useState();

  useEffect(() => {
    if (order) {
      DataStore.query(Restaurant, order.orderRestaurantId).then(setRestaurant);
    }
  }, [order]);

  if (!restaurant || !order) {
    return (
      <ActivityIndicator
        size={"large"}
        color={"gray"}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }
  return (
    <Pressable
      onPress={() => navigation.navigate("OrderDetail", { id: order.id })}
      style={{ flexDirection: "row", margin: 10, alignItems: "center" }}
    >
      <Image
        source={{ uri: restaurant.image }}
        style={{ width: 75, height: 75, marginRight: 5 }}
      />

      <View>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>
          {restaurant.name}
        </Text>
        <Text style={{ marginVertical: 5 }}>${order.total.toFixed(2)}</Text>
        <Text>
          {order.createdAt
            ? order.createdAt.substring(0, order.createdAt.indexOf("T"))
            : "just created"}{" "}
          &#8226; {order.status}{" "}
        </Text>
      </View>
    </Pressable>
  );
};

export default OrderListItem;

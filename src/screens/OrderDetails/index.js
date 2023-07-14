import { View, Text, Image, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import BasketDishItem from "../../components/BasketDishItem";
import styles from "./styles";
import { useOrderContext } from "../../contexts/orderContext";
import { ActivityIndicator } from "react-native-paper";

const OrderDetailsHeader = ({ order }) => {
  return (
    <View>
      <View style={styles.page}>
        <Image source={{ uri: order.Restaurant.image }} style={styles.image} />

        <View style={styles.container}>
          <Text style={styles.title}>{order.Restaurant.name}</Text>
          <Text style={styles.subtitle}>
            {order.status} &#8226;{" "}
            {order.createdAt
              ? order.createdAt.substring(0, order.createdAt.indexOf("T"))
              : "just created"}
          </Text>

          <Text style={styles.menuTitle}>Your orders</Text>
        </View>
      </View>
    </View>
  );
};

const OrderDetails = ({ id }) => {
  const [order, setOrder] = useState();
  const { getOrder } = useOrderContext();

  useEffect(() => {
    getOrder(id).then(setOrder);
  }, []);

  if (!order) {
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
    <FlatList
      ListHeaderComponent={() => <OrderDetailsHeader order={order} />}
      data={order.dishes}
      renderItem={({ item }) => <BasketDishItem basketDish={item} />}
    />
  );
};

export default OrderDetails;

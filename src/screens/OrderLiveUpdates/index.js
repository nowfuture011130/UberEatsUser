import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { DataStore } from "@aws-amplify/datastore";
import { Order, Driver } from "../../models";
import { FontAwesome5 } from "@expo/vector-icons";
const OrderLiveUpdates = ({ id }) => {
  const [order, setOrder] = useState(null);
  const [driver, setDriver] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    DataStore.query(Order, id).then(setOrder);
    if (driver?.lng && driver?.lat) {
      mapRef.current.animateToRegion({
        latitude: driver.lat,
        longitude: driver.lng,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      });
    }
  }, []);
  useEffect(() => {
    if (order?.driverID && order?.driverID != "null") {
      DataStore.query(Driver, order.driverID).then(setDriver);
    }
  }, [order]);
  useEffect(() => {
    if (driver?.lng && driver?.lat) {
      mapRef.current.animateToRegion({
        latitude: driver.lat,
        longitude: driver.lng,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      });
    }
  }, [driver?.lng, driver?.lat]);

  useEffect(() => {
    if (!driver) {
      return;
    }
    const subscription = DataStore.observe(Driver, driver.id).subscribe(
      (msg) => {
        if (msg.opType === "UPDATE") {
          setDriver(msg.element);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <View>
      <Text>Status: {order?.status || "loading"}</Text>
      <MapView style={styles.map} ref={mapRef}>
        {driver?.lat && (
          <Marker coordinate={{ latitude: driver.lat, longitude: driver.lng }}>
            <View style={styles.driverIconContainer}>
              <FontAwesome5 name="motorcycle" size={24} color="white" />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  driverIconContainer: {
    padding: 5,
    backgroundColor: "green",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "black",
  },
});

export default OrderLiveUpdates;

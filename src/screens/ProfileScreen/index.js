import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("0");
  const [lng, setLng] = useState("0");
  const { sub, setDbuser } = useAuthContext();
  const onSave = async () => {
    try {
      const user = await DataStore.save(
        new User({
          name: name,
          address: address,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          sub: sub,
        })
      );

      setDbuser(user);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={styles.input}
      />
      <TextInput
        value={lat}
        onChangeText={setLat}
        placeholder="Latitude"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        value={lng}
        onChangeText={setLng}
        placeholder="Longitude"
        style={styles.input}
      />
      <Pressable
        onPress={onSave}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "blue" : "cornflowerblue", margin: 20 },
        ]}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            margin: 10,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Save
        </Text>
      </Pressable>
      <Pressable
        onPress={() => Auth.signOut()}
        style={{ backgroundColor: "lightgray", margin: 20 }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "red",
            margin: 10,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Sign Out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;

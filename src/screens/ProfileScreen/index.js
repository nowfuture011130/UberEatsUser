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
import { User2 } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { sub, setDbuser, dbUser } = useAuthContext();

  const [name, setName] = useState(dbUser ? dbUser.name : "");
  const [address, setAddress] = useState(dbUser ? dbUser.address : "");
  const [lat, setLat] = useState(dbUser ? dbUser.lat + "" : "0");
  const [lng, setLng] = useState(dbUser ? dbUser.lng + "" : "0");
  const navigation = useNavigation();

  useEffect(() => {
    const update = DataStore.observeQuery(User2, (c) =>
      c.sub.eq(sub)
    ).subscribe(({ items }) => {
      setDbuser(items[0]);
    });

    return () => {
      update.unsubscribe();
    };
  }, []);

  const onSave = async () => {
    if (dbUser) {
      await updateUser();
    } else {
      await createUser();
    }
    navigation.goBack();
  };
  const updateUser = async () => {
    console.log(dbUser);
    const user = await DataStore.save(
      User2.copyOf(dbUser, (updated) => {
        updated.name = name;
        updated.address = address;
        updated.lat = parseFloat(lat);
        updated.lng = parseFloat(lng);
      })
    );
  };
  const createUser = async () => {
    try {
      const user = await DataStore.save(
        new User2({
          name: name,
          address: address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          sub: sub,
        })
      );
      setDbuser(user);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const signoutPress = async () => {
    Auth.signOut();
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
        onPress={signoutPress}
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

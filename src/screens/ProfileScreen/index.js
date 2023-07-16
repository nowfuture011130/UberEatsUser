import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { User2 } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const Profile = () => {
  const { sub, setDbuser, dbUser } = useAuthContext();

  const [name, setName] = useState(dbUser ? dbUser.name : "");
  const [address, setAddress] = useState(dbUser ? dbUser.address : "");
  const [googleAddress, setGoogleAddress] = useState(null);
  const [lat, setLat] = useState(dbUser ? dbUser.lat + "" : "0");
  const [lng, setLng] = useState(dbUser ? dbUser.lng + "" : "0");

  const navigation = useNavigation();

  const getAddressLatLng = async (userAddress, details) => {
    setGoogleAddress(userAddress);
    setAddress(userAddress.description);
    setLat(details?.geometry?.location.lat);
    setLng(details?.geometry?.location.lng);
  };

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
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <View style={{ paddingLeft: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          Current Address:
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "400", paddingTop: 10 }}>
          {address}
        </Text>
      </View>
      <GooglePlacesAutocomplete
        styles={{
          textInputContainer: {
            padding: 10,
          },
          textInput: {
            height: 50,
          },
        }}
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true}
        placeholder="Search your address here"
        onPress={(data, details = null) => {
          getAddressLatLng(data, details);
        }}
        query={{
          key: "AIzaSyD0g5cZwzDSDdWGZ7qdU1pxooPTgUriE3M",
          language: "en",
        }}
      />
      {/* <GooglePlacesAutocomplete
        apiKey="AIzaSyD0g5cZwzDSDdWGZ7qdU1pxooPTgUriE3M"
        selectProps={{ value: googleAddress, onChange: getAddressLatLng }}
      /> */}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            width: "100%",
            height: "80%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
          }}
        >
          <Pressable
            onPress={onSave}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "blue" : "cornflowerblue",
                margin: 20,
                width: "80%",
              },
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
            style={{ backgroundColor: "lightgray", margin: 20, width: "80%" }}
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
        </View>
      </KeyboardAvoidingView>
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

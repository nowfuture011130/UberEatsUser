import { View, Text, Alert } from "react-native";
import { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import "@azure/core-asynciterator-polyfill";
import { User2 } from "../models";
const Context = createContext({});

const AuthContext = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbuser] = useState(null);
  const getUser = async (sub) => {
    const models = await DataStore.query(User2, (a) => a.sub.eq(sub));
    console.log("all users is" + models);
    if (models) setDbuser(models[0]);
  };
  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);
  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    if (sub) {
      try {
        getUser(sub);
      } catch (e) {
        Alert.alert("Error", e.message);
      }
    }
  }, [sub]);

  return (
    <Context.Provider value={{ authUser, dbUser, sub, setDbuser }}>
      {children}
    </Context.Provider>
  );
};

export default AuthContext;

export const useAuthContext = () => useContext(Context);

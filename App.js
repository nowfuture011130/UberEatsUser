import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import RootNavigator from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import awsExports from "./src/aws-exports";
import AuthContext from "./src/contexts/AuthContext";
import BasketContext from "./src/contexts/basketContext";
import OrderContextProvider from "./src/contexts/orderContext";

Amplify.configure({ ...awsExports, Analytics: { disabled: true } });

function App() {
  return (
    <NavigationContainer>
      <AuthContext>
        <BasketContext>
          <OrderContextProvider>
            <RootNavigator />
          </OrderContextProvider>
        </BasketContext>
      </AuthContext>

      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);

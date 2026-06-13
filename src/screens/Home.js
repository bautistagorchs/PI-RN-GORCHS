import { StyleSheet, Text } from "react-native";
import { auth } from "../config/firebase";
import { useEffect } from "react";

const Home = ({ navigation }) => {
  useEffect(() => {
    if (!auth.currentUser) {
      navigation.navigate("Register");
    }
  }, [navigation]);
  console.log(auth.currentUser);
  return <Text>Bienvenido a Cortado</Text>;
};

const s = StyleSheet.create({
  button: {
    backgroundColor: "#4f46e5",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
});

export default Home;

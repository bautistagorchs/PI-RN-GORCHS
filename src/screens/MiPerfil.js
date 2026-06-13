import { Pressable, StyleSheet, Text, View } from "react-native";
import { auth } from "../config/firebase";

const MiPerfil = ({ navigation }) => {
  const logout = () => {
    auth.signOut();
    // .then(() => navigation.navigate("Login"))
    // .catch((error) => {
    //   console.error("Logout error:", error);
    //   alert("Logout failed: " + error.message);
    // });
    navigation.navigate("Login");
  };
  return (
    <View>
      <Pressable style={s.button} onPress={logout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
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

export default MiPerfil;

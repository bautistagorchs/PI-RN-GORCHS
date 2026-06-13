import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";
import { auth } from "../config/firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("Current user in Login screen:", auth.currentUser?.email);
    if (auth.currentUser) {
      navigation.navigate("Cortado");
    }
  }, [navigation]);

  const onSubmit = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate("Cortado"))
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      });
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Login</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Email"
        placeholderTextColor="#999"
      />
      <TextInput
        style={s.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#999"
      />
      <Pressable style={s.button} onPress={onSubmit}>
        <Text style={s.buttonText}>Submit</Text>
      </Pressable>
      <Pressable
        style={[s.button, { backgroundColor: "#6b7280", marginTop: 12 }]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={s.buttonText}>Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#1a1a1a",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#1a1a1a",
  },
  button: {
    backgroundColor: "#4f46e5",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;

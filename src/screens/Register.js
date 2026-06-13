import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";
import { auth, db } from "../config/firebase";

const Register = ({ navigation }) => {
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.onAuthStateChanged) {
      navigation.navigate("Cortado");
    }
  }, []);

  const submitForm = () => {
    auth
      .createUserWithEmailAndPassword(formValues.email, formValues.password)
      .then(() =>
        db
          .collection("users")
          .add({
            email: formValues.email,
            username: formValues.username,
            password: formValues.password,
          })
          .then(() => navigation.navigate("Login"))
          .catch((error) => console.error(error)),
      )
      .catch((error) => {
        console.error("Registration error:", error);
        // alert("Registration failed: " + error.message);
        setError(error.message);
      });
  };

  const logout = () => {
    auth
      .signOut()
      .then(() => navigation.navigate("Login"))
      .catch((error) => {
        console.error("Logout error:", error);
        setError("Logout failed: " + error.message);
      });
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Register</Text>
      <TextInput
        style={s.input}
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#999"
        value={formValues.email}
        onChangeText={(email) => setFormValues({ ...formValues, email })}
      />
      <TextInput
        style={s.input}
        keyboardType="default"
        placeholder="Username"
        placeholderTextColor="#999"
        value={formValues.username}
        onChangeText={(username) => setFormValues({ ...formValues, username })}
      />
      <TextInput
        style={s.input}
        keyboardType="default"
        placeholder="Password"
        placeholderTextColor="#999"
        value={formValues.password}
        secureTextEntry={true}
        onChangeText={(password) => setFormValues({ ...formValues, password })}
      />
      <Text style={s.error}>{error}</Text>
      <Pressable style={s.button} onPress={submitForm}>
        <Text style={s.buttonText}>Submit</Text>
      </Pressable>
      <Pressable
        style={[s.button, { backgroundColor: "#6b7280", marginTop: 12 }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={s.buttonText}>Already have an account? Login</Text>
      </Pressable>
      <Pressable
        style={[s.button, { backgroundColor: "#e53e3e", marginTop: 12 }]}
        onPress={logout}
      >
        <Text style={s.buttonText}>Logout</Text>
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
  error: {
    color: "#e53e3e",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default Register;

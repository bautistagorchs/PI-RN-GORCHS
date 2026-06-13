import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";

const MiPerfil = ({ navigation }) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return navigation.navigate("Login");
    }
    db.collection("users")
      .where("email", "==", user?.email)
      .get()
      .then((snapshot) => {
        console.log("Datos del usuario obtenidos:", snapshot.docs);
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUserData(userData);
        }
      })
      .then(() => {
        db.collection("posts")
          .where("email", "==", user?.email)
          .get()
          .then((snapshot) => {
            const posts = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserPosts(posts);
          });
      })
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
        setLoading(false);
      });
  }, [user]);

  const logout = () => {
    auth.signOut();
    navigation.navigate("Login");
  };

  if (loading) {
    return (
      <View style={s.loading}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.profileSection}>
          <Text style={s.label}>Nombre de Usuario</Text>
          <Text style={s.value}>
            {userData?.username || userData?.username || "No disponible"}
          </Text>

          <Text style={s.label}>Email</Text>
          <Text style={s.value}>
            {userData?.email || userData?.email || "No disponible"}
          </Text>
        </View>

        <View style={s.postsContainer}>
          <Text style={s.label}>Mis Posts</Text>
          {userPosts.length === 0 ? (
            <Text style={s.value}>No has publicado nada aún.</Text>
          ) : (
            userPosts.map((post) => (
              <View key={post.id} style={s.postItem}>
                <Text style={s.postTitle}>{post.descripcion}</Text>
                {/* <Image source={{ uri: post.imagen }} style={s.postImage} /> */}
              </View>
            ))
          )}
        </View>

        <Pressable style={s.button} onPress={logout}>
          <Text style={s.buttonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  profileSection: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  postsContainer: {
    marginBottom: 24,
  },
  postItem: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#4f46e5",
  },
});

export default MiPerfil;

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { auth, db } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const Home = ({ navigation, user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      navigation.navigate("Register");
    }
  }, [navigation]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("fecha", "desc")
      .onSnapshot((docs) => {
        const posts = [];
        docs.docs.forEach((doc) =>
          posts.push({
            id: doc.id,
            data: doc.data(),
          }),
        );
        setPosts(posts);
        setLoading(false);
      });
  }, []);

  const toggleLike = (postId, currentLikes) => {
    const postRef = db.collection("posts").doc(postId);
    const userId = auth.currentUser.email;
    const userHasLiked = currentLikes?.includes(userId);

    const updatedLikes = userHasLiked
      ? currentLikes.filter((email) => email !== userId)
      : [...(currentLikes || []), userId];

    postRef.update({ likes: updatedLikes });
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Cortado</Text>
        <Text style={s.headerSubtitle}>Tu red social de café ☕</Text>
      </View>

      {/* Feed Section */}
      <View style={s.feedSection}>
        <Text style={s.sectionTitle}>
          {loading ? "Cargando publicaciones..." : "Publicaciones recientes"}
        </Text>

        {loading ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color="#ff9800" />
            <Text style={s.loadingText}>
              Trayendo las mejores publicaciones...
            </Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={s.emptyContainer}>
            <Text style={s.emptyIcon}>
              <Ionicons name="cafe" size={48} color="#ff9800" />
            </Text>
            <Text style={s.emptyTitle}>Sin publicaciones</Text>
            <Text style={s.emptyText}>
              No hay publicaciones para mostrar aún
            </Text>
          </View>
        ) : (
          <View style={s.postsContainer}>
            {posts.map((post) => {
              const userHasLiked = post.data.likes?.includes(
                auth.currentUser.email,
              );

              return (
                <View key={post.id} style={s.postItem}>
                  <View style={s.postHeader}>
                    <View style={s.userInfo}>
                      <View style={s.avatar}>
                        <Text style={s.avatarText}>
                          {post.data.email?.[0]?.toUpperCase() || "U"}
                        </Text>
                      </View>
                      <View>
                        <Text style={s.userName}>
                          {post.data.username || post.data.email || "Usuario"}
                        </Text>
                        <Text style={s.postTime}>
                          {post.data.fecha
                            ? new Date(
                                post.data.fecha.toDate(),
                              ).toLocaleDateString("es-ES")
                            : "Hace poco"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={s.postDescription}>{post.data.descripcion}</Text>

                  {post.data.imagen && (
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${post.data.imagen}`,
                      }}
                      style={s.postImage}
                      resizeMode="cover"
                    />
                  )}

                  <View style={s.postFooter}>
                    <Text style={s.postInteraction}>
                      <Pressable
                        onPress={() => toggleLike(post.id, post.data.likes)}
                      >
                        <Ionicons
                          name={userHasLiked ? "heart" : "heart-outline"}
                          size={24}
                          color={userHasLiked ? "red" : "#6b7280"}
                        />
                      </Pressable>
                      {post.data.likes?.length || 0}
                    </Text>
                    <Text style={s.postInteraction}>
                      <Ionicons name="chatbubble" size={22} color="#6b7280" />
                      {post.data.comments || 0}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Header Styles
  header: {
    backgroundColor: "#e55e46",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e7ff",
    fontWeight: "500",
  },

  // Feed Section Styles
  feedSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  // Loading Styles
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },

  // Posts Container
  postsContainer: {
    gap: 12,
  },

  // Post Item Styles
  postItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  // Post Header
  postHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff9800",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  postTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },

  // Post Description
  postDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: "500",
  },

  // Post Image
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#e5e7eb",
  },

  // Post Footer
  postFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  postInteraction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
  },
});

export default Home;

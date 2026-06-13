import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { auth, db } from "../config/firebase";
import Camara from "../components/Camara";
import Toast from "react-native-toast-message";

const CrearPost = ({ navigation }) => {
  const [descripcion, setDescripcion] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };

  const publicar = () => {
    if (!descripcion.trim()) {
      showToast(
        "error",
        "Descripción vacía",
        "Por favor, agrega una descripción.",
      );
      return;
    }
    if (!photoUri) {
      showToast("error", "Imagen requerida", "Por favor, agrega una imagen.");
      return;
    }
    db.collection("posts")
      .add({
        descripcion,
        imagen: photoUri,
        email: auth.currentUser.email,
        fecha: new Date(),
        likes: [],
        comments: [],
      })
      .then(() => {
        showToast(
          "success",
          "Publicación exitosa",
          "Tu post ha sido publicado.",
        );
        setDescripcion("");
        setPhotoUri(null);
        return navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error al publicar:", error);
        showToast("error", "Error al publicar", "Intenta nuevamente.");
      });
  };

  return (
    <View style={s.container}>
      <Text style={s.titulo}>Crear Post</Text>

      {showCamera ? (
        <Camara
          onSave={(uri) => {
            setPhotoUri(uri);
            setShowCamera(false);
          }}
        />
      ) : (
        <View>
          <TextInput
            style={s.input}
            placeholder="¿Qué querés compartir?"
            placeholderTextColor="#999"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          {photoUri ? (
            <Image
              style={s.preview}
              source={{ uri: `data:image/png;base64,${photoUri}` }}
            />
          ) : null}

          <Pressable style={s.botonImagen} onPress={() => setShowCamera(true)}>
            <Text style={s.botonImagenTexto}>
              {" "}
              {photoUri ? "Nueva imagen" : "Agregar imagen"}
            </Text>
          </Pressable>

          <Pressable style={s.boton} onPress={publicar}>
            <Text style={s.botonTexto}>Publicar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1a1a1a",
    textAlignVertical: "top",
    marginBottom: 16,
  },
  botonImagen: {
    backgroundColor: "#ffffff",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#3b82f6",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  botonImagenTexto: {
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: 15,
  },
  preview: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  boton: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CrearPost;

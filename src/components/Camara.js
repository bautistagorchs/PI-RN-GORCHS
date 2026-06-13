import { Camera, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { manipulateAsync } from "expo-image-manipulator";

const Camara = (props) => {
  const [permisos, setPermisos] = useState(null);
  const [uri, setUri] = useState(null);
  let metodosCamara = useRef(null);

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
      .then(() => setPermisos(true))
      .catch(() => console.error("Error al solicitar permisos de cámara"));
  }, []);

  const takePicture = () => {
    metodosCamara.current
      .takePictureAsync()
      .then((foto) => {
        return manipulateAsync(foto.uri, [{ resize: { width: 200 } }], {
          compress: 0.7,
          base64: true,
        });
      })
      .then((resultado) => {
        setUri(resultado.base64);
      })
      .catch((error) => console.error("Error al tomar la foto:", error));
  };

  const savePhoto = () => {
    props.onSave(uri);
  };

  const clearPhoto = () => {
    setUri(null);
  };

  return (
    <View style={s.camaraContainer}>
      {!permisos ? (
        <View style={s.camaraContainer}>
          <Text style={s.camaraTexto}>
            Necesitas dar permisos de cámara para usar esta función
          </Text>
        </View>
      ) : uri ? (
        <View style={s.camaraContainer}>
          <Image
            style={s.preview}
            source={{ uri: `data:image/png;base64,${uri}` }}
          />
          <View style={s.buttonArea}>
            <Pressable style={s.botonAceptar} onPress={() => savePhoto()}>
              <Text style={s.botonTexto}>Aceptar</Text>
            </Pressable>
            <Pressable style={s.botonRechazar} onPress={() => clearPhoto()}>
              <Text style={s.botonTexto}>Rechazar</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={s.liveContainer}>
          <View style={s.liveFrame}>
            <CameraView
              style={s.liveCamera}
              facing="front"
              ref={metodosCamara}
            />
          </View>
          <Pressable style={s.botonCaptura} onPress={() => takePicture()}>
            <Text style={s.botonCapturaTexto}>Tomar Foto</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  camaraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  camaraTexto: {
    fontSize: 18,
    color: "#333",
  },
  liveContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  liveFrame: {
    width: "100%",
    height: 420,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  liveCamera: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  botonCaptura: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  botonCapturaTexto: {
    color: "#FFF",
    fontSize: 16,
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  buttonArea: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  botonAceptar: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
  },
  botonRechazar: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 6,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Camara;

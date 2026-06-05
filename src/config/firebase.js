import { initializeApp } from "firebase/app";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA7X4idlzKNBpnp8bPwjTJyBQOBjspSNi8",
  authDomain: "pi-rn-gorchs.firebaseapp.com",
  projectId: "pi-rn-gorchs",
  storageBucket: "pi-rn-gorchs.firebasestorage.app",
  messagingSenderId: "1016883681406",
  appId: "1:1016883681406:web:0f75911268c46e5fa4a02f",
};

const app = initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = app.firestore();

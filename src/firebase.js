import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBkvmMSlznPMOFVzICeTR3xY0TmXu8vL8c",
  authDomain: "on-track-f53f6.firebaseapp.com",
  databaseURL: "https://on-track-f53f6.firebaseio.com",
  projectId: "on-track-f53f6",
  storageBucket: "on-track-f53f6.appspot.com",
  messagingSenderId: "1008969712100",
  appId: "1:1008969712100:web:a4cbecc622d3afcd6747f1",
  measurementId: "G-RXHCTR5WX8",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider,getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwv77gqUI1CBh9On4lirnlXU7txa2vQvY",
  authDomain: "hotel-sistec-33916.firebaseapp.com",
  projectId: "hotel-sistec-33916",
  storageBucket: "hotel-sistec-33916.appspot.com",
  messagingSenderId: "263830756764",
  appId: "1:263830756764:web:5e152f91f789d52a4e7c59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const auth = getAuth(app);
export{app, auth, db, provider,analytics,storage}
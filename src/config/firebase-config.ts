// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYvneWCRjy5VidJYJWvKnF98XgDQ24Spo",
  authDomain: "khoaluantotnghiep-fbb33.firebaseapp.com",
  projectId: "khoaluantotnghiep-fbb33",
  storageBucket: "khoaluantotnghiep-fbb33.appspot.com",
  messagingSenderId: "863257110582",
  appId: "1:863257110582:web:b4cc6859988b141ee0d097",
  measurementId: "G-TC865HK8V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
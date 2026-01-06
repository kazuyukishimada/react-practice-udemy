// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFktTcOcncV0QXD4L1gR0EqsNNb2wTxiA",
  authDomain: "householdtypescript-e9378.firebaseapp.com",
  projectId: "householdtypescript-e9378",
  storageBucket: "householdtypescript-e9378.firebasestorage.app",
  messagingSenderId: "1097232099998",
  appId: "1:1097232099998:web:148d3fcdd96ce2bfb7e98f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
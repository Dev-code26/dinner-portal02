import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyDQMgjLjyG-V7Z418HLFh3-cRcpIvFH770",
  authDomain: "dinner-app-26984.firebaseapp.com",
  projectId: "dinner-app-26984",
  storageBucket: "dinner-app-26984.firebasestorage.app",
  messagingSenderId: "48952848188",
  appId: "1:48952848188:web:0c2041d8287afec9937839"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

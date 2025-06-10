
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNo1slINjmDFd6s6ptKGllMrdez1_X1xg",
  authDomain: "inventory-d7688.firebaseapp.com",
  projectId: "inventory-d7688",
  storageBucket: "inventory-d7688.firebasestorage.app",
  messagingSenderId: "736276455708",
  appId: "1:736276455708:web:eb8f87af7888a3dbb51ad9"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCX3bjucu1fkVY_Mq87gjrp-8TnwtyrIIk",
  authDomain: "flash-card-app-5ee1b.firebaseapp.com",
  projectId: "flash-card-app-5ee1b",
  storageBucket: "flash-card-app-5ee1b.appspot.com",
  messagingSenderId: "292214936517",
  appId: "1:292214936517:web:dd88678d7ae6300d40f1ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential; 
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error; 
  }
};


const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
  } catch (error) {
    console.error('Login error:', error.message);
    throw error; 
  }
};

export { db, auth, registerUser, loginUser };

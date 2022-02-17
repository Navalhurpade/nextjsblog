import { initializeApp, getApps, getApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDttJ7Yr6Bea3mofRiIozKguQJjPTFEbHk',
  authDomain: 'naval-nextjs-blog.firebaseapp.com',
  projectId: 'naval-nextjs-blog',
  storageBucket: 'naval-nextjs-blog.appspot.com',
  messagingSenderId: '153092077095',
  appId: '1:153092077095:web:4592d89d97a49b97f30002',
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const googleAuthProvider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const logInWithGoogle = async () => await signInWithPopup(auth, googleAuthProvider);
export const logOut = async () => await signOut(auth);
export const firestore = getFirestore(app);
export default app;
import { initializeApp, getApps, getApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, signInWithCredential, getAuth, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Router from 'next/router';

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
export const logInWithGoogle = async () => {
  return await signInWithPopup(
    auth,
    googleAuthProvider.setCustomParameters({
      prompt: 'select_account',
    })
  );
  // await signInWithCredential(auth, googleAuthProvider);
};
export const logOut = async () => {
  await signOut(auth);
  Router.push('/');
};
export const firestore = getFirestore(app);
export default app;

export const storage = getStorage(app);
// export const STATE_CHANGED =

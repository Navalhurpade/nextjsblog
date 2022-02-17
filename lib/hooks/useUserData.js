import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default () => {
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState(null);

  if (error) {
    console.log('ERORR in useAuthState', error);
  }

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = onSnapshot(doc(firestore, `users/${user.uid}`), (snapshot) => {
        console.log('username loaded');
        setUserName(snapshot.data()?.userName);
      });
    } else {
      console.log('Not logged in.');
    }

    return unsubscribe;
  }, [user]);

  return { userName, user, setUserName };
};

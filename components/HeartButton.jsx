import React, { useContext } from 'react';
import { doc, getDoc, increment, writeBatch } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { firestore } from '../lib/firebase';
import AuthContext from '../lib/AuthContext';
import Heart from './Heart';

function HeartButton({ post }) {
  const { user } = useContext(AuthContext);
  const [heart, setHeart] = useState(false);
  const postDocRef = doc(firestore, `users/${post.uid}/posts/${post.slug}`);
  const heartRef = doc(firestore, `users/${post.uid}/posts/${post.slug}/hearts/${user?.uid}`);

  useEffect(async () => {
    const isHearted = (await getDoc(heartRef)).exists();
    isHearted ? setHeart(true) : setHeart(false);
  }, [post]);

  const removeHeart = async () => {
    const batch = writeBatch(firestore);
    batch.delete(heartRef);
    batch.update(postDocRef, { heartCount: increment(-1) });

    await batch.commit();
  };

  const heartPost = async () => {
    const batch = writeBatch(firestore);
    batch.set(heartRef, { uid: user.uid });
    batch.update(postDocRef, { heartCount: increment(1) });

    await batch.commit();
  };

  return (
    <Heart
      liked={heart}
      onClick={() => {
        heart ? removeHeart() : heartPost();
      }}
    />
  );
}

export default HeartButton;

import { collection, getDocs, where, query, limit, orderBy, DocumentSnapshot } from 'firebase/firestore';
import { firestore } from './firebase';

const getUserByUsername = async (username) => {
  try {
    let colRef = collection(firestore, 'users');
    let userQuery = query(colRef, where('userName', '==', username));
    let userDoc = await getDocs(userQuery);
    let user = null;

    if (userDoc.docs.length) {
      user = userDoc.docs[0];
    }
    return user;
  } catch (error) {
    console.log('error while getting user', error);
  }
};

const getUserPosts = async (userId, onlyPublished = true) => {
  try {
    let colRef = collection(firestore, 'users', userId, 'posts');

    let postsQuery = query(
      colRef,
      ...(onlyPublished ? [where('published', '==', true)] : []),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    let postsDoc = await getDocs(postsQuery);
    let posts = [];

    if (postsDoc?.docs?.length) {
      posts = postsDoc.docs.map(postToJSON);
    }

    return posts;
  } catch (error) {
    console.log('error while getting user', error);
  }
};

/**
 * converts firestore documents to JSON
 * @param {DocumentSnapshot} doc
 */

const postToJSON = (doc) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt?.toMillis(),
    updatedAt: data?.updatedAt?.toMillis(),
    ref: JSON.stringify(doc?.ref),
  };
};

export { getUserByUsername, getUserPosts, postToJSON };

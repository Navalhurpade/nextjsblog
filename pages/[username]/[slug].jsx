import React from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  query,
  collectionGroup,
  DocumentReference,
  where,
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { getUserByUsername, postToJSON } from '../../lib/dbInteraction';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserByUsername(username);
  let post;
  let path;

  if (userDoc) {
    const postRef = collection(userDoc.ref, `/posts`);
    const postQuery = query(postRef, where('slug', '==', slug));

    post = postToJSON((await getDocs(postQuery)).docs[0]);
    path = postRef.path;
  }

  return {
    props: {
      post,
      path,
    },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  let collRef = collectionGroup(firestore, 'posts');
  let postQuery = query(collRef);

  let paths = (await getDocs(postQuery)).docs.map(postToJSON).map((p) => {
    return {
      params: {
        username: p.userName.toString(),
        slug: p.slug.toString(),
      },
    };
  });

  /**
   * return format must be
   *  path: [
   *   { params: {userName, slug} }
   *  ]
   */
  return {
    paths,
    fallback: 'blocking',
  };
}

const PostDetailed = ({ post, path }) => {
  return <div>sd</div>;
};

export default PostDetailed;

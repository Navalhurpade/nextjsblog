import { async } from '@firebase/util';
import { collectionGroup, getDocs, limit, orderBy, query, where, startAt, Timestamp } from 'firebase/firestore';
import Head from 'next/head';
import Image from 'next/image';
import { postToJSON } from '../lib/dbInteraction';
import { firestore } from '../lib/firebase';
import styles from '../styles/Home.module.css';
import Postfeed from './../components/Postfeed';
import Loader from './../components/Loader';
import { useState } from 'react';
const LIMIT = 1;

export async function getServerSideProps() {
  try {
    let collRef = collectionGroup(firestore, 'posts');
    let postQuery = query(collRef);

    let initialPosts = (await getDocs(postQuery)).docs.map(postToJSON);
    return {
      props: {
        initialPosts,
      },
    };
  } catch (error) {
    console.log('Error while getting posts siver side', error);
  }
}

export default function Home({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);

    const lastPost = posts[posts.length - 1];

    const lastPostAtTime =
      typeof lastPost.createdAt === 'number' ? Timestamp.fromMillis(lastPost.createdAt) : lastPost.createdAt;

    let collRef = collectionGroup(firestore, 'posts');
    let postQuery = query(
      collRef,
      where('plublished', '==', true),
      orderBy('createdAt', 'desc'),
      startAt(lastPostAtTime),
      limit(LIMIT)
    );

    let morePosts = (await getDocs(postQuery)).docs.map(postToJSON);

    setPosts(posts.concat(morePosts));
    setLoading(false);

    if (morePosts.length < LIMIT) {
      setReachedToEnd(true);
    }
  };

  return (
    <div>
      <Postfeed posts={posts} />
      {!reachedToEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={loading} />
      {reachedToEnd && 'you reached end of page'}
    </div>
  );
}

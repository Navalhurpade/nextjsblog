import { async } from '@firebase/util';
import { collectionGroup, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import Head from 'next/head';
import Image from 'next/image';
import { postToJSON } from '../lib/dbInteraction';
import { firestore } from '../lib/firebase';
import styles from '../styles/Home.module.css';

const LIMIT = 1;

export async function getServerSideProps() {
  try {
    let collRef = collectionGroup(firestore, 'posts');
    let postQuery = query(collRef, where('plublished', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT));

    let posts = (await getDocs(postQuery)).docs.map(postToJSON);
    console.log('POSTS:: ', posts);
    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.log('Error while getting posts siver side', error);
  }
}

export default function Home({ posts }) {
  return <div>Home</div>;
}

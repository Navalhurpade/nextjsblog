import React from 'react';
import { collection, getDocs, doc, query, collectionGroup, where } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getUserByUsername, postToJSON } from '../../lib/dbInteraction';
import styles from './../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import Metatags from './../../components/Metadata';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserByUsername(username);
  let post = null;
  let path = null;

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    const postRef = collection(userDoc.ref, `/posts`);
    const postQuery = query(postRef, where('slug', '==', slug));
    const postDoc = (await getDocs(postQuery)).docs[0];
    post = postToJSON(postDoc);
    path = postDoc.ref.path;
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

const Post = (props) => {
  const docRef = doc(firestore, props.path);
  const [realTimePost] = useDocumentData(query(docRef));
  let post = realTimePost || props.post;

  return (
    <>
      <Metatags title={post.title} />
      <main className={styles.container}>
        <section>
          <PostContent post={post} />
        </section>

        <aside className="card">
          <p>
            <strong> {post.heartCount || 0}❤️ </strong>
            <AuthCheck>
              <HeartButton post={post} postRef={docRef} uid={post.uid} />
            </AuthCheck>
          </p>
        </aside>
      </main>
    </>
  );
};

export default Post;

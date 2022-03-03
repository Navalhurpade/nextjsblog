import React, { useContext, useEffect, useState } from 'react';
import AuthCheck from '../../components/AuthCheck';
import PostItem from './../../components/PostItem';
import { getUserPosts } from '../../lib/dbInteraction';
import AuthContext from '../../lib/AuthContext';
import kebabCase from 'lodash.kebabcase';
import style from './../../styles/Admin.module.css';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { route } from 'next/dist/server/router';
import toast from 'react-hot-toast';

function Admin(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreatePost />
      </AuthCheck>
    </main>
  );
}

function PostList(props) {
  const { userName, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    const posts = await getUserPosts(user.uid);
    // console.log('POSTS', posts);
    setPosts(posts);
  }, []);

  return (
    <div>
      Manage your posts
      {posts.map((post) => (
        <PostItem post={post} key={post.slug} admin></PostItem>
      ))}
    </div>
  );
}

const CreatePost = ({}) => {
  const [title, setTitle] = useState('');
  const { user, userName } = useContext(AuthContext);

  let slug = encodeURI(kebabCase(title));
  let isVisible = title.length > 3;

  const createNewPost = async (e) => {
    e.preventDefault();
    const newPostRef = doc(firestore, `users/${user.uid}/posts/${slug}`);
    const data = {
      title,
      slug,
      uid: user.uid,
      userName,
      content: '# Hello word!',
      createAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(newPostRef, data);
    toast.success('Post created !');
    route(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createNewPost}>
      <input className={style.input} onChange={(e) => setTitle(e.target.value)} value={title}></input>
      <p>
        <strong>slug: </strong>
        {slug}
      </p>
      <button type="submit" disabled={!isVisible} className="btn-green">
        Create new post
      </button>
    </form>
  );
};

export default Admin;

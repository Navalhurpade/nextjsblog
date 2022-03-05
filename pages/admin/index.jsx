import React, { useContext, useEffect, useState } from 'react';
import { getUserPosts } from '../../lib/dbInteraction';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import Router from 'next/router';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

import AuthContext from '../../lib/AuthContext';
import AuthCheck from '../../components/AuthCheck';
import PostItem from './../../components/PostItem';
import style from './../../styles/Admin.module.css';

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

function PostList() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    const posts = await getUserPosts(user.uid, false);
    if (posts.length) setPosts(posts);
  }, []);

  return posts.length ? (
    <div>
      Manage your posts
      {posts.map((post) => (
        <PostItem post={post} key={post.slug} linkToAdmin></PostItem>
      ))}
    </div>
  ) : (
    <></>
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
    const newPost = {
      title,
      slug,
      uid: user.uid,
      userName,
      content: '# Hello word!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(newPostRef, newPost);
    toast.success('Post created !');
    Router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createNewPost}>
      <label htmlFor="newPostTitle">Create new post</label>
      <input id="newPostTitle" className={style.input} onChange={(e) => setTitle(e.target.value)} value={title}></input>
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

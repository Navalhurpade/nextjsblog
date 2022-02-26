import React from 'react';
import Postfeed from '../../components/Postfeed';
import UserProfile from '../../components/UserProfile';
import { getUserByUsername, getUserPosts } from '../../lib/dbInteraction';

export async function getServerSideProps({ query }) {
  const { username } = query;
  let userDoc = await getUserByUsername(username);

  let user = null;
  let posts = null;

  if (userDoc?.data()) {
    user = userDoc?.data();
    posts = await getUserPosts(userDoc.id);
  }
  return {
    props: {
      user,
      posts,
    },
  };
}

function index({ user, posts }) {
  return (
    <div>
      <UserProfile user={user} />
      <Postfeed posts={posts} admin={user} />
    </div>
  );
}

export default index;

import React from 'react';
import PostItem from './PostItem';

function Postfeed({ posts, admin }) {
  return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : <div></div>;
}

export default Postfeed;

import Link from 'next/link';
import React from 'react';
// import ReactMarkdown from 'markdown-to-jsx';
import ReactMarkdown from 'react-markdown';

function PostContent({ post }) {
  console.log('data is::', post, typeof post.createdAt, post.createdAt);
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt?.toDate();
  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written By
        <Link href={`/${post.userName}`}>
          <a className="text-info">@{post.userName}</a>
        </Link>
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}

export default PostContent;
